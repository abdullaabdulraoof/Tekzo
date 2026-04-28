from app.retriever import retrieve
from app.context_builder import build_context
from app.generator import generate_answer

def chat(query):
    results = retrieve(query)
    context = build_context(results)
    answer = generate_answer(query, context)

    return answer, results