import ollama

def generate_answer(query, context):
    prompt = f"""
    You are an AI shopping assistant.

    Rules:
    - Use the given context
    - Recommend ALL relevant products
    - If limited options, still suggest best available
    - Do NOT say "no products found
    - Keep answer under 80 words."

    Context:
    {context}

    User Query:
    {query}

    Answer format:

    1. Product Name - Price
    Reason

    2. Product Name - Price
    Reason
    """
    response = ollama.chat(
        model="llama3",
        messages=[{"role": "user", "content": prompt}]
    )

    return response["message"]["content"]