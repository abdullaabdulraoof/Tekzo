import numpy as np
import requests
from app.embedder import model
from app.vectorstore import load_vectorstore

NODE_API_URL = "http://localhost:3000/api"

index, docs = load_vectorstore()

# =========================================
# 🔹 STOCK HELPERS (Phase 24)
# =========================================

def get_stock_value(product):
    return (
        product.get("stock")
        or product.get("quantity")
        or product.get("countInStock")
        or product.get("availableStock")
        or product.get("stockQuantity")
        or 0
    )


def is_product_available(product):
    if product.get("isAvailable") is False:
        return False

    status = str(product.get("status", "")).lower()
    if status in ["out of stock", "inactive", "unavailable"]:
        return False

    return get_stock_value(product) > 0


# =========================================
# 🔹 CLEAN PRODUCT
# =========================================

def extract_name(content):
    if " by " in content:
        return content.split(" by ")[0].strip()
    return content.split("\n")[0].strip()


def clean_product(item):
    metadata = item.get("metadata", {})
    content = item.get("content", "")

    stock = (
        metadata.get("stock")
        or metadata.get("quantity")
        or metadata.get("countInStock")
        or metadata.get("availableStock")
        or metadata.get("stockQuantity")
        or 0
    )

    is_available = metadata.get("isAvailable", True)

    return {
        "id": metadata.get("id"),
        "name": metadata.get("name") or extract_name(content),
        "brand": metadata.get("brand", ""),
        "price": metadata.get("price", 0),
        "category": metadata.get("category", ""),
        "tag": metadata.get("tag", ""),
        "summary": content[:220] + "..." if len(content) > 220 else content,
        "stock": stock,
        "isAvailable": is_available,
        "inStock": is_available and stock > 0
    }


# =========================================
# 🔹 CATEGORY DETECTION
# =========================================

def detect_category(query):
    q = query.lower()

    if any(w in q for w in ["earbud", "earphone", "headphone", "audio"]):
        return "audio"

    if "laptop" in q:
        return "laptop"

    if any(w in q for w in ["watch", "smartwatch", "wearable"]):
        return "wearables"

    if any(w in q for w in ["phone", "mobile"]):
        return "mobiles"

    if any(w in q for w in ["pc", "desktop"]):
        return "pc"

    if any(w in q for w in ["charger", "cable", "adapter"]):
        return "accessories"

    return None


# =========================================
# 🔹 PRICE EXTRACTION
# =========================================

def extract_under_price(query):
    q = query.lower().replace(",", "")
    words = q.split()

    for i, word in enumerate(words):
        if word in ["under", "below"] and i + 1 < len(words):
            value = words[i + 1]

            try:
                if value.endswith("k"):
                    return int(value.replace("k", "")) * 1000
                return int(value)
            except:
                return None

    return None


# =========================================
# 🔹 FILTERING
# =========================================

def apply_filters(query, results):
    category = detect_category(query)
    if category:
        temp = [r for r in results if category in r.get("metadata", {}).get("category", "").lower()]
        if temp:
            results = temp

    max_price = extract_under_price(query)
    if max_price:
        temp = [r for r in results if r.get("metadata", {}).get("price", 0) <= max_price]
        if temp:
            results = temp

    return results


# =========================================
# 🔹 TEXT SCORING
# =========================================

def get_text_score(query, item):
    q = query.lower()
    metadata = item.get("metadata", {})
    content = item.get("content", "").lower()

    name = str(metadata.get("name", "")).lower()
    brand = str(metadata.get("brand", "")).lower()
    tag = str(metadata.get("tag", "")).lower()

    score = 0

    for word in q.split():
        if word in tag:
            score += 40
        elif word in name:
            score += 25
        elif word in brand:
            score += 20
        elif word in content:
            score += 5

    return score


# =========================================
# 🔹 SEARCH PRODUCTS
# =========================================

def search_products(query, k=10):
    embedding = model.encode([query])
    embedding = np.array(embedding).astype("float32")

    distances, indexes = index.search(embedding, k)

    scored = {}

    for rank, i in enumerate(indexes[0]):
        if i != -1:
            item = docs[i]
            score = 100 - (rank * 8) + get_text_score(query, item)

            pid = item.get("metadata", {}).get("id")

            scored[pid] = {"item": item, "score": score}

    for item in docs:
        pid = item.get("metadata", {}).get("id")
        score = get_text_score(query, item)

        if score > 0:
            if pid in scored:
                scored[pid]["score"] += score
            else:
                scored[pid] = {"item": item, "score": score}

    results = [x["item"] for x in sorted(scored.values(), key=lambda x: x["score"], reverse=True)]

    results = apply_filters(query, results)

    clean_results = [clean_product(r) for r in results]

    # ✅ STOCK FILTER
    clean_results = [p for p in clean_results if is_product_available(p)]

    return clean_results[:5]


# =========================================
# 🔹 CART APIs
# =========================================

def add_to_cart(product_id, token=None):
    if not token:
        return {"success": False, "message": "Login required"}

    try:
        res = requests.post(
            f"{NODE_API_URL}/cart",
            json={"productId": product_id},
            headers={"Authorization": f"Bearer {token}"}
        )

        return {
            "success": res.status_code == 200,
            "message": res.json().get("message", "")
        }

    except Exception as e:
        return {"success": False, "error": str(e)}


def get_cart(token=None):
    if not token:
        return {"success": False, "items": [], "total": 0}

    try:
        res = requests.get(
            f"{NODE_API_URL}/cart",
            headers={"Authorization": f"Bearer {token}"}
        )

        data = res.json()

        items = [
            {
                "id": str(i.get("_id")),
                "name": i.get("name"),
                "price": i.get("offerPrice") or i.get("price"),
                "quantity": i.get("quantity"),
                "totalPrice": i.get("totalPrice")
            }
            for i in data.get("cartItems", [])
        ]

        return {
            "success": True,
            "items": items,
            "total": data.get("totalCartPrice", 0)
        }

    except Exception as e:
        return {"success": False, "error": str(e), "items": [], "total": 0}


# =========================================
# 🔹 ORDER TRACKING (Phase 25)
# =========================================

def get_orders(token=None):
    if not token:
        return {"success": False, "orders": []}

    try:
        res = requests.get(
            f"{NODE_API_URL}/orders",
            headers={"Authorization": f"Bearer {token}"}
        )

        return {
            "success": res.status_code == 200,
            "orders": res.json().get("orders", [])
        }

    except Exception as e:
        return {"success": False, "error": str(e), "orders": []}


# =========================================
# 🔥 CANCEL ORDER (Phase 26)
# =========================================

def cancel_order(order_id, token=None):
    if not token:
        return {"success": False, "message": "Login required"}

    try:
        res = requests.post(
            f"{NODE_API_URL}/orders/{order_id}/cancel",
            headers={"Authorization": f"Bearer {token}"}
        )

        return {
            "success": res.status_code == 200,
            "message": res.json().get("message", "Cancel processed")
        }

    except Exception as e:
        return {"success": False, "error": str(e)}


# =========================================
# 🔥 RETURN ORDER (Phase 26)
# =========================================

def return_order(order_id, token=None):
    if not token:
        return {"success": False, "message": "Login required"}

    try:
        res = requests.post(
            f"{NODE_API_URL}/orders/{order_id}/return",
            headers={"Authorization": f"Bearer {token}"}
        )

        return {
            "success": res.status_code == 200,
            "message": res.json().get("message", "Return processed")
        }

    except Exception as e:
        return {"success": False, "error": str(e)}


# =========================================
# 🔹 COMPARE
# =========================================

def compare_products(query):
    products = search_products(query)

    if len(products) < 2:
        return {"success": False, "products": products}

    p1, p2 = products[:2]

    return {
        "success": True,
        "message": f"{p1['name']} vs {p2['name']}",
        "products": [p1, p2]
    }


# =========================================
# 🔹 REMOVE / UPDATE CART
# =========================================

def remove_from_cart(product_id, token=None):
    try:
        res = requests.delete(
            f"{NODE_API_URL}/cart/{product_id}",
            headers={"Authorization": f"Bearer {token}"}
        )
        return {"success": res.status_code == 200}
    except:
        return {"success": False}


def update_cart_quantity(product_id, action, token=None):
    try:
        res = requests.put(
            f"{NODE_API_URL}/cart",
            json={"productId": product_id, "action": action},
            headers={"Authorization": f"Bearer {token}"}
        )
        return {"success": res.status_code == 200}
    except:
        return {"success": False}


# =========================================
# 🔹 ADMIN INVENTORY INTELLIGENCE (Phase 27)
# =========================================

def get_low_stock(token):
    try:
        res = requests.get(
            f"{NODE_API_URL}/admin/products/low-stock",
            headers={"Authorization": f"Bearer {token}"}
        )
        return res.json()
    except Exception as e:
        return {"success": False, "message": str(e)}


def get_top_selling(token):
    try:
        res = requests.get(
            f"{NODE_API_URL}/admin/products/top-selling",
            headers={"Authorization": f"Bearer {token}"}
        )
        return res.json()
    except Exception as e:
        return {"success": False, "message": str(e)}


def get_dead_stock(token):
    try:
        res = requests.get(
            f"{NODE_API_URL}/admin/products/dead-stock",
            headers={"Authorization": f"Bearer {token}"}
        )
        return res.json()
    except Exception as e:
        return {"success": False, "message": str(e)}