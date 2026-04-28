import faiss
import json
import numpy as np
import os

VECTOR_PATH = "vectorstore/faiss_index.bin"
METADATA_PATH = "vectorstore/metadata.json"


def create_faiss_index(embeddings):
    embeddings = np.array(embeddings).astype("float32")

    dimension = embeddings.shape[1]
    index = faiss.IndexFlatL2(dimension)
    index.add(embeddings)

    return index


def save_vectorstore(index, formatted):
    os.makedirs("vectorstore", exist_ok=True)

    faiss.write_index(index, VECTOR_PATH)

    with open(METADATA_PATH, "w", encoding="utf-8") as f:
        json.dump(formatted, f, indent=2)
    print("✅ Saved FAISS + JSON metadata")

def load_vectorstore():
    if not os.path.exists(VECTOR_PATH):
        raise Exception("Run ingestion first")

    index = faiss.read_index(VECTOR_PATH)

    with open(METADATA_PATH, "r", encoding="utf-8") as f:
        formatted = json.load(f)

    return index, formatted