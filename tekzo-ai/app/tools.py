# import requests

# BASE_URL = "http://localhost:3000"



# # 🔹 Tool 2: Find cheapest
# def get_cheapest(products):
#     return min(products, key=lambda x: x["metadata"]["price"])

# def search_products(query):
#     index, docs = load_vectorstore()

#     embedding = model.encode([query])
#     embedding = np.array(embedding).astype("float32")

#     D, I = index.search(embedding, k=3)

#     results = []
#     for i in I[0]:
#         if i != -1:
#             results.append(docs[i])

#     return results

# def add_to_cart(product_id, token):
#     import requests

#     try:
#         res = requests.post(
#             "http://localhost:3000/api/cart",
#             json={"productId": product_id},
#             headers={"Authorization": f"Bearer {token}"}
#         )
#         return {"status": "success"}
#     except:
#         return {"status": "failed"}    




import numpy as np
import requests
from app.embedder import model
from app.vectorstore import load_vectorstore
NODE_API_URL = "http://localhost:3000/api"

index, docs = load_vectorstore()


def extract_name(content):
    if " by " in content:
        return content.split(" by ")[0].strip()

    return content.split("\n")[0].strip()


def clean_product(item):
    metadata = item.get("metadata", {})
    content = item.get("content", "")

    return {
        "id": metadata.get("id"),
        "name": metadata.get("name") or extract_name(content),
        "brand": metadata.get("brand", ""),
        "price": metadata.get("price", 0),
        "category": metadata.get("category", ""),
        "tag": metadata.get("tag", ""),
        "summary": content[:220] + "..." if len(content) > 220 else content,
    }


def detect_category(query):
    q = query.lower()

    if any(word in q for word in ["earbud", "earbuds", "earphone", "earphones", "headphone", "headphones", "audio", "neckband"]):
        return "audio"

    if any(word in q for word in ["laptop", "gaming laptop", "coding laptop"]):
        return "laptop"

    if any(word in q for word in ["watch", "smartwatch", "wearable", "wearables", "fitness"]):
        return "wearables"

    if any(word in q for word in ["phone", "mobile", "smartphone"]):
        return "mobiles"

    if any(word in q for word in ["pc", "desktop", "gaming pc"]):
        return "pc"

    if any(word in q for word in ["charger", "cable", "adapter", "accessory", "accessories"]):
        return "accessories"

    return None


def extract_under_price(query):
    q = query.lower().replace(",", "")
    words = q.split()

    for i, word in enumerate(words):
        if word in ["under", "below"] and i + 1 < len(words):
            value = words[i + 1]

            try:
                if i + 2 < len(words) and words[i + 2] in ["lakh", "lakhs"]:
                    return int(value) * 100000

                if value.endswith("k"):
                    return int(value.replace("k", "")) * 1000

                return int(value)
            except ValueError:
                return None

    return None



    q = query.lower()

    category = detect_category(query)

    if category:
        filtered = [
            item for item in results
            if category in item.get("metadata", {}).get("category", "").lower()
        ]

        if filtered:
            results = filtered

    max_price = extract_under_price(query)

    if max_price:
        price_filtered = [
            item for item in results
            if item.get("metadata", {}).get("price", 0) <= max_price
        ]

        if price_filtered:
            results = price_filtered

    is_budget = any(word in q for word in ["budget", "cheap", "affordable", "low price"])
    is_premium = any(word in q for word in ["premium", "flagship", "high end", "high-end"])

    if is_budget:
        results = sorted(
            results,
            key=lambda item: item.get("metadata", {}).get("price", 0)
        )

    elif is_premium:
        results = sorted(
            results,
            key=lambda item: item.get("metadata", {}).get("price", 0),
            reverse=True
        )

    return results
def apply_filters(query, results):
    q = query.lower()

    category = detect_category(query)

    # 1. Category filter
    if category:
        filtered = [
            item for item in results
            if category in item.get("metadata", {}).get("category", "").lower()
        ]

        if filtered:
            results = filtered

    # 2. Strong tag-based filters
    if "gaming" in q:
        tag_filtered = [
            item for item in results
            if "gaming" in item.get("metadata", {}).get("tag", "").lower()
        ]

        if tag_filtered:
            results = tag_filtered

    if "student" in q or "coding" in q:
        tag_filtered = [
            item for item in results
            if any(
                word in item.get("metadata", {}).get("tag", "").lower()
                for word in ["student", "coding"]
            )
        ]

        if tag_filtered:
            results = tag_filtered

    if "watch" in q or "smartwatch" in q:
        tag_filtered = [
            item for item in results
            if "watch" in item.get("metadata", {}).get("tag", "").lower()
        ]

        if tag_filtered:
            results = tag_filtered

    if "glass" in q or "glasses" in q:
        tag_filtered = [
            item for item in results
            if "glass" in item.get("metadata", {}).get("tag", "").lower()
        ]

        if tag_filtered:
            results = tag_filtered

    # 3. Price filter
    max_price = extract_under_price(query)

    if max_price:
        price_filtered = [
            item for item in results
            if item.get("metadata", {}).get("price", 0) <= max_price
        ]

        if price_filtered:
            results = price_filtered

    # 4. Sorting
    is_budget = any(word in q for word in ["budget", "cheap", "affordable", "low price"])
    is_premium = any(word in q for word in ["premium", "flagship", "high end", "high-end"])

    if is_budget:
        results = sorted(
            results,
            key=lambda item: item.get("metadata", {}).get("price", 0)
        )

    elif is_premium:
        results = sorted(
            results,
            key=lambda item: item.get("metadata", {}).get("price", 0),
            reverse=True
        )

    return results

def search_products(query, k=8):
    query_embedding = model.encode([query])
    query_embedding = np.array(query_embedding).astype("float32")

    distances, indexes = index.search(query_embedding, k)

    results = []

    for i in indexes[0]:
        if i != -1:
            results.append(docs[i])

    results = apply_filters(query, results)

    clean_results = [clean_product(item) for item in results]

    return clean_results[:5]


def add_to_cart(product_id, token=None):
    if not token:
        return {
            "success": False,
            "message": "Login required to add products to cart."
        }

    try:
        response = requests.post(
            f"{NODE_API_URL}/cart",
            json={
                "productId": product_id
            },
            headers={
                "Authorization": f"Bearer {token}"
            },
            timeout=10
        )

        if response.status_code == 200:
            return {
                "success": True,
                "message": "Product added to cart successfully.",
                "data": response.json()
            }

        return {
            "success": False,
            "message": "Failed to add product to cart.",
            "status_code": response.status_code,
            "error": response.json()
        }

    except Exception as e:
        return {
            "success": False,
            "message": "Cart service error.",
            "error": str(e)
        }

def get_cart(token=None):
    if not token:
        return {
            "success": False,
            "message": "Login required to view cart.",
            "items": [],
            "total": 0
        }

    try:
        response = requests.get(
            f"{NODE_API_URL}/cart",
            headers={
                "Authorization": f"Bearer {token}"
            },
            timeout=10
        )

        if response.status_code != 200:
            return {
                "success": False,
                "message": "Failed to fetch cart.",
                "status_code": response.status_code,
                "error": response.json(),
                "items": [],
                "total": 0
            }

        data = response.json()

        items = []

        for item in data.get("cartItems", []):
            items.append({
                "id": str(item.get("_id")),
                "name": item.get("name"),
                "brand": item.get("brandName"),
                "price": item.get("offerPrice") or item.get("price"),
                "quantity": item.get("quantity", 1),
                "totalPrice": item.get("totalPrice", 0),
                "category": item.get("category")
            })

        return {
            "success": True,
            "message": "Cart fetched successfully.",
            "items": items,
            "total": data.get("totalCartPrice", 0)
        }

    except Exception as e:
        return {
            "success": False,
            "message": "Cart service error.",
            "error": str(e),
            "items": [],
            "total": 0
        }
def compare_products(query):
    products = search_products(query)

    if len(products) < 2:
        return {
            "success": False,
            "message": "I couldn't find enough products to compare.",
            "products": products
        }

    selected = products[:2]

    p1 = selected[0]
    p2 = selected[1]

    comparison = f"""
Comparison:

1. {p1['name']}
- Brand: {p1['brand']}
- Category: {p1['category']}
- Price: ₹{p1['price']}
- Summary: {p1['summary']}

2. {p2['name']}
- Brand: {p2['brand']}
- Category: {p2['category']}
- Price: ₹{p2['price']}
- Summary: {p2['summary']}

Recommendation:
If you want a lower price, choose {p1['name'] if p1['price'] < p2['price'] else p2['name']}.
If you want a more premium option, choose {p1['name'] if p1['price'] > p2['price'] else p2['name']}.
"""

    return {
        "success": True,
        "message": comparison.strip(),
        "products": selected
    }

def remove_from_cart(product_id, token=None):
    if not token:
        return {
            "success": False,
            "message": "Login required to remove products from cart."
        }

    try:
        response = requests.delete(
            f"{NODE_API_URL}/cart/{product_id}",
            headers={
                "Authorization": f"Bearer {token}"
            },
            timeout=10
        )

        if response.status_code == 200:
            return {
                "success": True,
                "message": "Product removed from cart successfully.",
                "data": response.json()
            }

        return {
            "success": False,
            "message": "Failed to remove product from cart.",
            "status_code": response.status_code,
            "error": response.json()
        }

    except Exception as e:
        return {
            "success": False,
            "message": "Cart remove service error.",
            "error": str(e)
        }
def update_cart_quantity(product_id, action, token=None):
    if not token:
        return {
            "success": False,
            "message": "Login required to update cart quantity."
        }

    try:
        response = requests.put(
            f"{NODE_API_URL}/cart",
            json={
                "productId": product_id,
                "action": action
            },
            headers={
                "Authorization": f"Bearer {token}"
            },
            timeout=10
        )

        if response.status_code == 200:
            return {
                "success": True,
                "message": "Cart quantity updated successfully.",
                "data": response.json()
            }

        return {
            "success": False,
            "message": "Failed to update cart quantity.",
            "status_code": response.status_code,
            "error": response.json()
        }

    except Exception as e:
        return {
            "success": False,
            "message": "Cart quantity service error.",
            "error": str(e)
        }