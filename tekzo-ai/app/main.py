from fastapi import FastAPI
from pydantic import BaseModel
from app.agent import run_agent
from app.personalization import extract_user_preferences, merge_preferences
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, Dict, Any
import json
import requests
from fastapi.responses import StreamingResponse
import os
from app.ingestion import run_ingestion

app = FastAPI()

MEMORY_FILE = "data/memory_store.json"

def load_memory():
    if os.path.exists(MEMORY_FILE):
        try:
            with open(MEMORY_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception:
            return {}
    return {}

def save_memory():
    os.makedirs("data", exist_ok=True)
    with open(MEMORY_FILE, 'w', encoding='utf-8') as f:
        json.dump(memory_store, f)

memory_store = load_memory()

NODE_API_URL = "http://localhost:3000/api"


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "https://tekzo-2j88.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Query(BaseModel):
    message: str
    token: str | None = None
    sessionId: str | None = None
    memory: Optional[Dict[str, Any]] = None


@app.get("/")
def health():
    return {"status": "AI service running"}

@app.post("/reindex")
def reindex_catalog():
    success = run_ingestion()
    if success:
        return {"status": "success", "message": "Vectorstore re-indexed"}
    return {"status": "error", "message": "Failed to re-index vectorstore"}


def get_user_preferences_from_node(token=None):
    if not token:
        return {}

    try:
        response = requests.get(
            f"{NODE_API_URL}/ai-analytics/preferences/me",
            headers={
                "Authorization": f"Bearer {token}"
            },
            timeout=5
        )

        if response.status_code != 200:
            return {}

        data = response.json()

        categories = data.get("categories", {})
        brands = data.get("brands", {})
        price_range = data.get("priceRange", {})

        if isinstance(categories, dict):
            categories_list = sorted(
                categories.keys(),
                key=lambda k: categories[k],
                reverse=True
            )
        else:
            categories_list = []

        if isinstance(brands, dict):
            brands_list = sorted(
                brands.keys(),
                key=lambda k: brands[k],
                reverse=True
            )
        else:
            brands_list = []

        budget_type = None

        max_price = price_range.get("max") if isinstance(price_range, dict) else None

        if max_price:
            if max_price <= 20000:
                budget_type = "budget"
            elif max_price >= 50000:
                budget_type = "premium"

        return {
            "categories": categories_list,
            "brands": brands_list,
            "budget_type": budget_type,
            "price_range": {
                "min": price_range.get("min") if isinstance(price_range, dict) else None,
                "max": price_range.get("max") if isinstance(price_range, dict) else None
            }
        }

    except Exception:
        return {}


def build_combined_memory(query: Query):
    # Prioritize sessionId for session isolation to prevent data leakage between users
    user_key = query.sessionId or query.token or "guest"

    server_memory = memory_store.get(user_key, {})
    client_memory = query.memory or {}
    db_preferences = get_user_preferences_from_node(query.token)

    combined_memory = {
        **server_memory,
        **client_memory
    }

    old_preferences = combined_memory.get("preferences", {})

    combined_memory["preferences"] = merge_preferences(
        old_preferences,
        db_preferences
    )

    return user_key, combined_memory


def log_to_node(token, query_message, result):
    if not token:
        return

    try:
        payload = {
            "query": query_message,
            "action": result.get("decision", {}).get("action") or "CHAT",
            "toolUsed": result.get("tool_used") or "none",
            "responseType": result.get("type") or "chat",
            "success": result.get("success", True),
            "productsShown": result.get("products", []),
            "upsellProductsShown": result.get("upsell_products", []),
            "bundleShown": result.get("bundle"),
            "cartTotal": result.get("cart", {}).get("total", 0),
            "message": result.get("message", "")[:200],
            "eventType": "ai_response"
        }

        requests.post(
            f"{NODE_API_URL}/ai-analytics/log",
            json=payload,
            headers={"Authorization": f"Bearer {token}"},
            timeout=3
        )
    except Exception as e:
        print(f"Failed to log to node: {e}")


def update_memory(user_key, query_message, result, combined_memory, token=None):
    new_memory = combined_memory.copy()

    if result.get("clear_memory"):
        new_memory.pop("pending_action", None)

    if result.get("pending_action"):
        new_memory["pending_action"] = result["pending_action"]

    if result.get("products"):
        new_memory["last_products"] = result["products"]

    if result.get("last_optimization_suggestions"):
        new_memory["last_optimization_suggestions"] = result["last_optimization_suggestions"]

    if result.get("clear_optimization_memory"):
        new_memory.pop("last_optimization_suggestions", None)

    new_prefs = extract_user_preferences(
        query_message,
        result.get("products", [])
    )

    old_prefs = new_memory.get("preferences", {})

    new_memory["preferences"] = merge_preferences(
        old_prefs,
        new_prefs
    )

    memory_store[user_key] = new_memory
    save_memory()

    # 🔹 LOG TO NODE FOR ANALYTICS
    log_to_node(token, query_message, result)

    return new_memory


@app.post("/chat")
def chat(query: Query):
    user_key, combined_memory = build_combined_memory(query)

    result = run_agent(
        query.message,
        query.token,
        memory=combined_memory
    )

    update_memory(
        user_key,
        query.message,
        result,
        combined_memory,
        token=query.token
    )

    return result


@app.post("/chat-stream")
def chat_stream(query: Query):
    def generate():
        user_key, combined_memory = build_combined_memory(query)

        result = run_agent(
            query.message,
            query.token,
            memory=combined_memory
        )

        message = result.get("message", "")

        for word in message.split():
            yield json.dumps({
                "type": "chunk",
                "content": word + " "
            }) + "\n"

        update_memory(
            user_key,
            query.message,
            result,
            combined_memory,
            token=query.token
        )

        yield json.dumps({
            "type": "final",
            "data": result
        }) + "\n"

    return StreamingResponse(generate(), media_type="application/x-ndjson")