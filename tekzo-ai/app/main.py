from fastapi import FastAPI
from pydantic import BaseModel
from app.agent import run_agent
from app.personalization import extract_user_preferences, merge_preferences
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, Dict, Any
import json
from fastapi.responses import StreamingResponse


app = FastAPI()

memory_store = {}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Query(BaseModel):
    message: str
    token: str | None = None
    memory: Optional[Dict[str, Any]] = None


@app.get("/")
def health():
    return {"status": "AI service running"}


@app.post("/chat")
def chat(query: Query):
    user_key = query.token or "guest"

    server_memory = memory_store.get(user_key, {})
    client_memory = query.memory or {}

    combined_memory = {
        **server_memory,
        **client_memory
    }

    result = run_agent(
        query.message,
        query.token,
        memory=combined_memory
    )

    new_memory = combined_memory.copy()

    # Clear pending confirmation after confirm/cancel
    if result.get("clear_memory"):
        new_memory.pop("pending_action", None)

    # Store pending confirmation
    if result.get("pending_action"):
        new_memory["pending_action"] = result["pending_action"]

    # Store last shown products
    if result.get("products"):
        new_memory["last_products"] = result["products"]

    # Phase 10: Learn user preferences
    new_prefs = extract_user_preferences(
        query.message,
        result.get("products", [])
    )

    old_prefs = new_memory.get("preferences", {})

    new_memory["preferences"] = merge_preferences(
        old_prefs,
        new_prefs
    )

    memory_store[user_key] = new_memory

    return result

@app.post("/chat-stream")
def chat_stream(query: Query):
    def generate():
        user_key = query.token or "guest"

        server_memory = memory_store.get(user_key, {})
        client_memory = query.memory or {}

        combined_memory = {
            **server_memory,
            **client_memory
        }

        result = run_agent(
            query.message,
            query.token,
            memory=combined_memory
        )

        # Send message text slowly
        message = result.get("message", "")

        for word in message.split():
            yield json.dumps({
                "type": "chunk",
                "content": word + " "
            }) + "\n"

        # Update memory after result
        new_memory = combined_memory.copy()

        if result.get("clear_memory"):
            new_memory.pop("pending_action", None)

        if result.get("pending_action"):
            new_memory["pending_action"] = result["pending_action"]

        if result.get("products"):
            new_memory["last_products"] = result["products"]

        new_prefs = extract_user_preferences(
            query.message,
            result.get("products", [])
        )

        old_prefs = new_memory.get("preferences", {})

        new_memory["preferences"] = merge_preferences(
            old_prefs,
            new_prefs
        )

        memory_store[user_key] = new_memory

        # Send final payload
        yield json.dumps({
            "type": "final",
            "data": result
        }) + "\n"

    return StreamingResponse(generate(), media_type="application/x-ndjson")