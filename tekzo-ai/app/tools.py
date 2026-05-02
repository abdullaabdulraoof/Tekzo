import numpy as np
import requests
import time
from app.embedder import model
from app.vectorstore import load_vectorstore

NODE_API_URL = "http://localhost:3000/api"

index, docs = load_vectorstore()

# =========================================
# 🔹 LOGGING HELPER
# =========================================
def log_tool(tool_name, details):
    print(f"🛠️ [TOOL_USED]: {tool_name} | {details}")

# =========================================
# 🔹 STOCK HELPERS
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
        "inStock": is_available and stock > 0,
        "images": metadata.get("images", [])
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
# 🔹 SEARCH PRODUCTS (Optimized O(N) Fix)
# =========================================

def search_products(query, k=50): # initial k is 50 for recall
    log_tool("search_products", f"query: {query}")
    
    embedding = model.encode([query])
    embedding = np.array(embedding).astype("float32")

    # Phase 1: FAISS Recall (Top 50)
    distances, indexes = index.search(embedding, k)

    scored = {}

    # Phase 2: Hybrid Re-ranking (Only on the Top 50 results)
    for rank, i in enumerate(indexes[0]):
        if i != -1:
            item = docs[i]
            # Semantic distance + Keyword boost
            score = 100 - (rank * 2) + get_text_score(query, item)
            pid = item.get("metadata", {}).get("id")
            scored[pid] = {"item": item, "score": score}

    # Sort and filter
    results = [x["item"] for x in sorted(scored.values(), key=lambda x: x["score"], reverse=True)]
    results = apply_filters(query, results)
    
    clean_results = [clean_product(r) for r in results]
    
    # Stock Filter
    final_results = [p for p in clean_results if is_product_available(p)]

    return final_results[:5]


# =========================================
# 🔹 CART APIs
# =========================================

def add_to_cart(product_id, token=None):
    if not token:
        return {"success": False, "message": "Login required"}

    log_tool("add_to_cart", f"productId: {product_id}")
    try:
        res = requests.post(
            f"{NODE_API_URL}/cart",
            json={"productId": product_id},
            headers={"Authorization": f"Bearer {token}"},
            timeout=5
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

    log_tool("get_cart", "fetching user cart")
    try:
        res = requests.get(
            f"{NODE_API_URL}/cart",
            headers={"Authorization": f"Bearer {token}"},
            timeout=5
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
# 🔹 ORDER TRACKING
# =========================================

def get_orders(token=None):
    if not token:
        return {"success": False, "orders": []}

    log_tool("get_orders", "fetching order history")
    try:
        res = requests.get(
            f"{NODE_API_URL}/orders",
            headers={"Authorization": f"Bearer {token}"},
            timeout=5
        )

        return {
            "success": res.status_code == 200,
            "orders": res.json().get("orders", [])
        }

    except Exception as e:
        return {"success": False, "error": str(e), "orders": []}


# =========================================
# 🔥 CANCEL / RETURN
# =========================================

def cancel_order(order_id, token=None):
    if not token:
        return {"success": False, "message": "Login required"}

    log_tool("cancel_order", f"orderId: {order_id}")
    try:
        res = requests.post(
            f"{NODE_API_URL}/orders/{order_id}/cancel",
            headers={"Authorization": f"Bearer {token}"},
            timeout=5
        )

        return {
            "success": res.status_code == 200,
            "message": res.json().get("message", "Cancel processed")
        }

    except Exception as e:
        return {"success": False, "error": str(e)}


def return_order(order_id, token=None):
    if not token:
        return {"success": False, "message": "Login required"}

    log_tool("return_order", f"orderId: {order_id}")
    try:
        res = requests.post(
            f"{NODE_API_URL}/orders/{order_id}/return",
            headers={"Authorization": f"Bearer {token}"},
            timeout=5
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
    log_tool("compare_products", f"query: {query}")
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
    log_tool("remove_from_cart", f"productId: {product_id}")
    try:
        res = requests.delete(
            f"{NODE_API_URL}/cart/{product_id}",
            headers={"Authorization": f"Bearer {token}"},
            timeout=5
        )
        return {"success": res.status_code == 200}
    except:
        return {"success": False}


def update_cart_quantity(product_id, action, token=None):
    log_tool("update_cart_quantity", f"productId: {product_id} | action: {action}")
    try:
        res = requests.put(
            f"{NODE_API_URL}/cart",
            json={"productId": product_id, "action": action},
            headers={"Authorization": f"Bearer {token}"},
            timeout=5
        )
        return {"success": res.status_code == 200}
    except:
        return {"success": False}


# =========================================
# 🔹 ADMIN INVENTORY INTELLIGENCE
# =========================================

def get_low_stock(token):
    log_tool("admin_low_stock", "fetching inventory alerts")
    try:
        res = requests.get(
            f"{NODE_API_URL}/admin/products/low-stock",
            headers={"Authorization": f"Bearer {token}"},
            timeout=5
        )
        return res.json()
    except Exception as e:
        return {"success": False, "message": str(e)}


def get_top_selling(token):
    log_tool("admin_top_selling", "fetching sales analytics")
    try:
        res = requests.get(
            f"{NODE_API_URL}/admin/products/top-selling",
            headers={"Authorization": f"Bearer {token}"},
            timeout=5
        )
        return res.json()
    except Exception as e:
        return {"success": False, "message": str(e)}


def get_dead_stock(token):
    log_tool("admin_dead_stock", "fetching stagnation reports")
    try:
        res = requests.get(
            f"{NODE_API_URL}/admin/products/dead-stock",
            headers={"Authorization": f"Bearer {token}"},
            timeout=5
        )
        return res.json()
    except Exception as e:
        return {"success": False, "message": str(e)}