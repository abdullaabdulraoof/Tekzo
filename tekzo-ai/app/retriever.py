import numpy as np
from app.embedder import model
from app.vectorstore import load_vectorstore

index, docs = load_vectorstore()

def retrieve(query, k=10):
    query_embedding = model.encode([query])
    query_embedding = np.array(query_embedding).astype("float32")

    D, I = index.search(query_embedding, k)

    results = [docs[i] for i in I[0] if i != -1]

    # 🔥 FILTER LOGIC
    if "budget" in query.lower():
        results = [r for r in results if r["metadata"]["price"] < 10000]

    if "premium" in query.lower():
        results = [r for r in results if r["metadata"]["price"] > 50000]

    query_lower = query.lower()

    # Detect category intent
    if "earbuds" in query_lower or "earphones" in query_lower:
        results = [r for r in results if "audio" in r["metadata"]["category"].lower()]

    if "laptop" in query_lower:
        results = [r for r in results if "laptop" in r["metadata"]["category"].lower()]

    if "watch" in query_lower:
        results = [r for r in results if "wearables" in r["metadata"]["category"].lower()]

    return results[:5]