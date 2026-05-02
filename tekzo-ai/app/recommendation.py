import re


# ==============================
# 🔹 PRICE PARSER
# ==============================
def parse_price_value(value, unit=None):
    value = value.lower().replace(",", "").replace("₹", "").strip()

    try:
        number = float(value.replace("k", ""))
    except ValueError:
        return None

    if "k" in value:
        return int(number * 1000)

    if unit in ["lakh", "lakhs", "lac", "lacs"]:
        return int(number * 100000)

    return int(number)


# ==============================
# 🔹 EXTRACT USER PREFERENCES
# ==============================
def extract_preferences(query):
    q = query.lower().replace(",", "")

    prefs = {
        "min_price": None,
        "max_price": None,
        "category": None,
        "keywords": [],
        "negative_keywords": [],
        "sort": "balanced"
    }

    # 🔹 price range (20k to 50k)
    range_match = re.search(r"(between|from)\s+(\d+(?:\.\d+)?k?)\s+(and|to)\s+(\d+(?:\.\d+)?k?)", q)
    if range_match:
        prefs["min_price"] = parse_price_value(range_match.group(2))
        prefs["max_price"] = parse_price_value(range_match.group(4))

    # 🔹 max price
    max_match = re.search(r"(under|below|less than)\s+(\d+(?:\.\d+)?k?)\s*(lakh|lakhs|lac|lacs)?", q)
    if max_match:
        prefs["max_price"] = parse_price_value(max_match.group(2), max_match.group(3))

    # 🔹 min price
    min_match = re.search(r"(above|over|more than)\s+(\d+(?:\.\d+)?k?)\s*(lakh|lakhs|lac|lacs)?", q)
    if min_match:
        prefs["min_price"] = parse_price_value(min_match.group(2), min_match.group(3))

    # 🔹 around price
    around_match = re.search(r"(around|near|approx)\s+(\d+(?:\.\d+)?k?)", q)
    if around_match:
        value = parse_price_value(around_match.group(2))
        if value:
            prefs["min_price"] = int(value * 0.8)
            prefs["max_price"] = int(value * 1.2)

    # 🔹 category detection
    if any(w in q for w in ["earbud", "headphone", "audio"]):
        prefs["category"] = "Audio"
    elif "laptop" in q:
        prefs["category"] = "Laptop"
    elif any(w in q for w in ["phone", "mobile"]):
        prefs["category"] = "Mobiles"
    elif any(w in q for w in ["watch", "smartwatch"]):
        prefs["category"] = "Wearables"

    # 🔹 keywords
    keywords = [
        "gaming", "camera", "battery", "student",
        "coding", "premium", "budget", "cheap",
        "fast charging", "noise cancellation"
    ]

    for k in keywords:
        if k in q:
            prefs["keywords"].append(k)

    # 🔹 negative keywords
    if "not gaming" in q:
        prefs["negative_keywords"].append("gaming")

    # 🔹 sorting
    if any(w in q for w in ["cheap", "budget"]):
        prefs["sort"] = "low_price"
    elif any(w in q for w in ["premium", "best"]):
        prefs["sort"] = "high_price"

    return prefs


# ==============================
# 🔹 APPLY MEMORY
# ==============================
def apply_memory_preferences(prefs, memory=None):
    if not memory:
        return prefs

    user_prefs = memory.get("preferences", {})

    # 🔹 CATEGORY PERSONALIZATION
    if not prefs.get("category"):
        categories = user_prefs.get("categories", [])
        if categories:
            prefs["category"] = categories[0]

    # 🔹 BRAND PERSONALIZATION
    prefs["preferred_brands"] = user_prefs.get("brands", [])

    # 🔹 BUDGET PERSONALIZATION
    if prefs.get("sort") == "balanced":
        budget_type = user_prefs.get("budget_type")

        if budget_type == "budget":
            prefs["sort"] = "low_price"
            prefs["keywords"].append("budget")

        elif budget_type == "premium":
            prefs["sort"] = "high_price"
            prefs["keywords"].append("premium")

    # 🔹 PRICE RANGE PERSONALIZATION
    price_range = user_prefs.get("price_range")

    if price_range:
        if not prefs.get("max_price") and price_range.get("max"):
            prefs["max_price"] = price_range["max"]

        if not prefs.get("min_price") and price_range.get("min"):
            prefs["min_price"] = price_range["min"]

    return prefs

# ==============================
# 🔹 FILTER PRODUCTS
# ==============================
def filter_products(products, prefs):
    filtered = products[:]

    # category filter
    if prefs.get("category"):
        filtered = [
            p for p in filtered
            if prefs["category"].lower() in str(p.get("category", "")).lower()
        ] or filtered

    # price filter
    min_price = prefs.get("min_price")
    max_price = prefs.get("max_price")

    if min_price or max_price:
        temp = []
        for p in filtered:
            price = p.get("price", 0)

            if min_price and price < min_price:
                continue
            if max_price and price > max_price:
                continue

            temp.append(p)

        if temp:
            filtered = temp

    return filtered


# ==============================
# 🔹 RANK PRODUCTS (CORE AI)
# ==============================
def rank_products(products, prefs):
    ranked = products[:]

    preferred_brands = [b.lower() for b in prefs.get("preferred_brands", [])]
    keywords = [k.lower() for k in prefs.get("keywords", [])]
    negative_keywords = [k.lower() for k in prefs.get("negative_keywords", [])]

    target_category = str(prefs.get("category", "")).lower()

    min_price = prefs.get("min_price")
    max_price = prefs.get("max_price")

    def score(p):
        s = 0

        name = str(p.get("name", "")).lower()
        brand = str(p.get("brand", "")).lower()
        category = str(p.get("category", "")).lower()
        tag = str(p.get("tag", "")).lower()
        summary = str(p.get("summary", "")).lower()
        price = p.get("price", 0) or 0

        searchable = f"{name} {brand} {category} {tag} {summary}"

        # =========================================
        # 🔹 CATEGORY MATCH (Strong signal)
        # =========================================
        if target_category and target_category in category:
            s += 50

        # =========================================
        # 🔹 KEYWORD MATCH
        # =========================================
        for k in keywords:
            if k in tag:
                s += 40
            elif k in name:
                s += 25
            elif k in summary:
                s += 10

        # =========================================
        # 🔹 NEGATIVE KEYWORDS (Hard penalty)
        # =========================================
        for k in negative_keywords:
            if k in searchable:
                s -= 80

        # =========================================
        # 🔹 BRAND PERSONALIZATION (Boosted)
        # =========================================
        if brand in preferred_brands:
            s += 60   # 🔥 stronger than before

        # =========================================
        # 🔹 PRICE RANGE SCORING
        # =========================================
        if min_price is not None:
            if price >= min_price:
                s += 20
            else:
                s -= 25

        if max_price is not None:
            if price <= max_price:
                s += 40
                # closer to max → slightly better
                s += max(0, (max_price - price) / max_price * 10)
            else:
                s -= 50

        # =========================================
        # 🔹 SORT STYLE (Budget / Premium)
        # =========================================
        if prefs.get("sort") == "low_price":
            s += max(0, 40 - (price / 3000))

        elif prefs.get("sort") == "high_price":
            s += price / 3000

        else:  # balanced
            s -= price / 10000

        # =========================================
        # 🔹 SPECIAL RULES (SMART FILTERING)
        # =========================================
        if "gaming" in keywords:
            if "gaming" in tag:
                s += 50
            if "not a gaming laptop" in summary:
                s -= 100

        if "watch" in keywords or "smartwatch" in keywords:
            if "watch" in tag:
                s += 50
            if "glass" in tag:
                s -= 100

        return s

    ranked.sort(key=score, reverse=True)
    return ranked
    

# ==============================
# 🔹 MESSAGE BUILDER
# ==============================
def build_recommendation_message(products, prefs):
    if not products:
        return "I couldn't find a suitable product."

    top = products[0]

    personalized_line = ""

    if prefs.get("preferred_brands"):
        brand = prefs["preferred_brands"][0]
        personalized_line += f"\n✔ Based on your interest in {brand}"

    if prefs.get("category"):
        personalized_line += f"\n✔ You often explore {prefs['category']} products"

    if prefs.get("sort") == "low_price":
        personalized_line += "\n✔ Matches your budget-friendly preference"

    if prefs.get("sort") == "high_price":
        personalized_line += "\n✔ Matches your premium preference"

    return f"""
🔥 Best choice for you: {top['name']}

💰 Price: ₹{top['price']}
🏷 Brand: {top['brand']}
📦 Category: {top['category']}

Why this?
✔ Strong match based on your behavior{personalized_line}

👉 Want me to add it to your cart?
""".strip()

# ==============================
# 🔹 MAIN FUNCTION
# ==============================
def recommend_products(query, products, memory=None):
    prefs = extract_preferences(query)
    prefs = apply_memory_preferences(prefs, memory)

    filtered = filter_products(products, prefs)

    if not filtered:
        filtered = products

    ranked = rank_products(filtered, prefs)

    return {
        "message": build_recommendation_message(ranked, prefs),
        "products": ranked[:3],
        "preferences": prefs
    }