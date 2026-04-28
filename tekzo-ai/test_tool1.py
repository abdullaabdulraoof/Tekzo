from app.tools import search_products

queries = [
    "best budget earbuds",
    "premium headphones",
    "gaming laptop",
    "cheap smartwatch",
    "best phone"
]

for q in queries:
    print("\nQUERY:", q)
    results = search_products(q)

    for item in results:
        print(
            item["name"],
            "|",
            item["brand"],
            "| ₹",
            item["price"],
            "|",
            item["category"]
        )