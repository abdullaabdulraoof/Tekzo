import re


def extract_preferences(query):
    q = query.lower()

    prefs = {
        "max_price": None,
        "category": None,
        "keywords": [],
        "sort": "balanced"
    }

    price_match = re.search(r"(under|below)\s+(\d+)", q)
    if price_match:
        prefs["max_price"] = int(price_match.group(2))

    lakh_match = re.search(r"(under|below)\s+(\d+)\s*lakh", q)
    if lakh_match:
        prefs["max_price"] = int(lakh_match.group(2)) * 100000

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

    for word in [
        "gaming", "camera", "battery", "student", "coding",
        "premium", "budget", "cheap", "affordable",
        "watch", "smartwatch"
    ]:
        if word in q:
            prefs["keywords"].append(word)

    if any(w in q for w in ["budget", "cheap", "affordable", "low price"]):
        prefs["sort"] = "low_price"
    elif any(w in q for w in ["premium", "flagship", "high end", "best"]):
        prefs["sort"] = "high_price"

    return prefs


def apply_memory_preferences(prefs, memory=None):
    if not memory:
        return prefs

    user_prefs = memory.get("preferences", {})

    # Use remembered category only when user asks generic recommendation
    if not prefs.get("category"):
        categories = user_prefs.get("categories", [])
        if categories:
            prefs["category"] = categories[-1]

    # Use remembered budget style only when query has no budget/premium signal
    if prefs.get("sort") == "balanced":
        budget_type = user_prefs.get("budget_type")
        if budget_type == "budget":
            prefs["sort"] = "low_price"
            if "budget" not in prefs["keywords"]:
                prefs["keywords"].append("budget")
        elif budget_type == "premium":
            prefs["sort"] = "high_price"
            if "premium" not in prefs["keywords"]:
                prefs["keywords"].append("premium")

    prefs["preferred_brands"] = user_prefs.get("brands", [])

    return prefs


def filter_products(products, prefs):
    filtered = products[:]
    keywords = prefs.get("keywords", [])

    if prefs.get("category"):
        category = prefs["category"].lower()
        temp = [
            p for p in filtered
            if category in str(p.get("category", "")).lower()
        ]
        if temp:
            filtered = temp

    if "gaming" in keywords:
        temp = [
            p for p in filtered
            if "gaming" in str(p.get("tag", "")).lower()
        ]
        if temp:
            filtered = temp

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
    preferred_brands = [b.lower() for b in prefs.get("preferred_brands", [])]

    def score(product):
        s = 0

        brand = str(product.get("brand", "")).lower()

        if brand in preferred_brands:
            s += 50

        if prefs.get("sort") == "low_price":
            s -= product.get("price", 0) / 1000

        elif prefs.get("sort") == "high_price":
            s += product.get("price", 0) / 1000

        else:
            s -= product.get("price", 0) / 3000

        return s

    ranked.sort(key=score, reverse=True)
    return ranked


def build_recommendation_message(products, prefs):
    if not products:
        return "I couldn't find a suitable product."

    top = products[0]
    keywords = prefs.get("keywords", [])

    reason = "general use"
    if keywords:
        reason = ", ".join(keywords)

    personalized = ""
    if prefs.get("preferred_brands"):
        personalized = "\n✔ Also considers your previous brand preferences"

    return f"""
🔥 Best choice for you: {top['name']}

💰 Price: ₹{top['price']}
🏷 Brand: {top['brand']}
📦 Category: {top['category']}

Why this?
✔ Matches your need for {reason}
✔ Fits your budget/style preference
✔ One of the best options in this category{personalized}

👉 Want me to add it to your cart?
""".strip()


def recommend_products(query, products, memory=None):
    prefs = extract_preferences(query)
    prefs = apply_memory_preferences(prefs, memory)

    filtered = filter_products(products, prefs)

    if not filtered:
        filtered = products

    ranked = rank_products(filtered, prefs)

    message = build_recommendation_message(ranked, prefs)

    return {
        "message": message,
        "products": ranked[:3],
        "preferences": prefs
    }