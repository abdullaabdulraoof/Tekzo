import time
import ollama

def test_model_speed(model_name, prompt):
    print(f"Testing {model_name}...")
    try:
        start = time.time()

        response = ollama.chat(
            model=model_name,
            messages=[{"role": "user", "content": prompt}]
        )

        end = time.time()
        duration = end - start
        
        print(f"✅ Model: {model_name}")
        print(f"⏱️  Time taken: {duration:.2f} seconds")
        print(f"💬 Response preview: {response['message']['content'][:50]}...")
    except Exception as e:
        print(f"❌ Error testing {model_name}: {e}")
    
    print("-" * 40)

if __name__ == "__main__":
    prompt = "Explain AI in 50 words"
    
    # List of models you want to compare
    # Note: Ensure these models are already 'pulled' in Ollama (e.g., ollama pull llama3)
    models = ["llama3", "mistral", "gemma", "phi3"]

    print("🚀 Starting AI Speed Benchmark...\n")
    for m in models:
        test_model_speed(m, prompt)
