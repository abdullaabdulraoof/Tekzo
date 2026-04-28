import re


def extract_preferences(query):
    q = query.lower()

    prefs = {
        "max_price": None,
        "category": None,
        "keywords": [],
        "sort": "balanced"
    }

    # 🔹 price: under 50000
    price_match = re.search(r"(under|below)\s+(\d+)", q)
    if price_match:
        prefs["max_price"] = int(price_match.group(2))

    # 🔹 price: under 1 lakh
    lakh_match = re.search(r"(under|below)\s+(\d+)\s*lakh", q)
    if lakh_match:
        prefs["max_price"] = int(lakh_match.group(2)) * 100000

    # 🔹 category
    if any(w in q for w in ["earbud", "earbuds", "earphone", "headphone", "audio"]):
        prefs["category"] = "Audio"

    elif "laptop" in q:
        prefs["category"] = "Laptop"

    elif any(w in q for w in ["phone", "mobile", "smartphone"]):
        prefs["category"] = "Mobiles"

    elif any(w in q for w in ["watch", "smartwatch", "wearable"]):
        prefs["category"] = "Wearables"

    elif any(w in q for w in ["pc", "desktop"]):
        prefs["category"] = "PC"

    elif any(w in q for w in ["charger", "adapter", "cable", "accessory"]):
        prefs["category"] = "Accessories"

    # 🔹 keywords
    for word in ["gaming", "camera", "battery", "student", "coding", "premium", "budget", "cheap", "affordable"]:
        if word in q:
            prefs["keywords"].append(word)

    # 🔹 sorting
    if any(w in q for w in ["budget", "cheap", "affordable", "low price"]):
        prefs["sort"] = "low_price"

    elif any(w in q for w in ["premium", "flagship", "high end", "best"]):
        prefs["sort"] = "high_price"

    return prefs


# 🔥 FIXED FILTER FUNCTION
def filter_products(products, prefs):
    filtered = products[:]
    keywords = prefs.get("keywords", [])

    # 🔹 Category filter
    if prefs.get("category"):
        category = prefs["category"].lower()
        temp = [
            p for p in filtered
            if category in str(p.get("category", "")).lower()
        ]
        if temp:
            filtered = temp

    # 🔹 Gaming filter
    if "gaming" in keywords:
        temp = [
            p for p in filtered
            if "gaming" in (
                str(p.get("tag", "")) + " " +
                str(p.get("name", "")) + " " +
                str(p.get("summary", ""))
            ).lower()
        ]

        if temp:
            filtered = temp
      

    # 🔹 Smartwatch filter (important fix)
    if prefs.get("category") == "Wearables":
        if any(k in keywords for k in ["watch", "smartwatch"]):
            temp = [
                p for p in filtered
                if "watch" in (
                str(p.get("tag", "")) + " " +
                str(p.get("name", "")) + " " +
                str(p.get("summary", ""))
                ).lower()
            ]
            if temp:
                filtered = temp

    # 🔹 Price filter
    if prefs.get("max_price"):
        temp = [
            p for p in filtered
            if p.get("price", 0) <= prefs["max_price"]
        ]
        if temp:
            filtered = temp

    return filtered


def rank_products(products, prefs):
    ranked = products[:]

    if prefs.get("sort") == "low_price":
        ranked.sort(key=lambda p: p.get("price", 0))

    elif prefs.get("sort") == "high_price":
        ranked.sort(key=lambda p: p.get("price", 0), reverse=True)

    else:
        ranked.sort(key=lambda p: p.get("price", 0))

    return ranked


# 🔥 IMPROVED MESSAGE (more human-like)
def build_recommendation_message(products, prefs):
    if not products:
        return "I couldn't find a suitable product."

    top = products[0]
    keywords = prefs.get("keywords", [])

    reason = "general use"
    if keywords:
        reason = ", ".join(keywords)

    return f"""
🔥 Best choice for you: {top['name']}

💰 Price: ₹{top['price']}
🏷 Brand: {top['brand']}
📦 Category: {top['category']}

Why this?
✔ Matches your need for {reason}
✔ Fits your budget (if specified)
✔ One of the best options in this category

👉 Want me to add it to your cart?
""".strip()


def recommend_products(query, products):
    prefs = extract_preferences(query)

    filtered = filter_products(products, prefs)

    # fallback if nothing found
    if not filtered:
        filtered = products

    ranked = rank_products(filtered, prefs)

    message = build_recommendation_message(ranked, prefs)

    return {
        "message": message,
        "products": ranked[:3],
        "preferences": prefs
    }