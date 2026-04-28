from fastapi import FastAPI
from pydantic import BaseModel
from app.agent import run_agent
from fastapi.middleware.cors import CORSMiddleware


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


@app.get("/")
def health():
    return {"status": "AI service running"}


@app.post("/chat")
def chat(query: Query):
    user_key = query.token or "guest"

    previous_memory = memory_store.get(user_key, {})

    result = run_agent(
        query.message,
        query.token,
        memory=previous_memory
    )

    if result.get("products"):
        memory_store[user_key] = {
            "last_products": result["products"]
        }

    return result