from app.decision import decide_action

queries = [
    "best budget earbuds",
    "add cheapest earbuds to cart",
    "what is in my cart",
    "hello"
]

for q in queries:
    print(q)
    print(decide_action(q))
    print("-----")