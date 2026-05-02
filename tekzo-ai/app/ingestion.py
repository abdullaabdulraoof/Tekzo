import requests
from app.embedder import model
from app.vectorstore import create_faiss_index, save_vectorstore
from app.data_formatter import format_product
import numpy as np

def fetch_products():
    url = "http://localhost:3000/ai/products"
    response = requests.get(url)
    return response.json()

def run_ingestion():
    try:
        products = fetch_products()
        if not products:
            print("⚠️ No products to ingest")
            return False

        formatted = [format_product(p) for p in products]
        texts = [item["content"] for item in formatted]
        
        embeddings = model.encode(texts)
        embeddings = np.array(embeddings).astype("float32")
        
        index = create_faiss_index(embeddings)
        save_vectorstore(index, formatted)
        
        print("✅ Ingestion complete")
        return True
    except Exception as e:
        print(f"❌ Ingestion failed: {e}")
        return False

if __name__ == "__main__":
    run_ingestion()