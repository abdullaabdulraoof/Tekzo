from app.chat import chat
from app.agent import run_agent


query = "best budget wireless earbuds"

answer, results = chat(query)

print("🔍 Retrieved Products:\n")
for r in results:
    print("-", r["metadata"]["brand"], "|", r["metadata"]["price"])

print("\n🤖 AI Answer:\n")
print(answer)


# 🔹 Normal query
print(run_agent("best budget earbuds"))

# 🔹 Cheapest
print(run_agent("show cheapest earbuds"))

# 🔹 Action
print(run_agent("add cheapest earbuds to cart"))