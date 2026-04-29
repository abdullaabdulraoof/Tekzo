def extract_user_preferences(query, products=None):
    q = query.lower()

    prefs = {
        "brands": [],
        "categories": [],
        "budget_type": None
    }

    brands = [
        "apple",
        "samsung",
        "sony",
        "oneplus",
        "nothing",
        "lenovo",
        "msi",
        "asus",
        "fastrack"
    ]

    for brand in brands:
        if brand in q:
            prefs["brands"].append(brand.title())

    if any(w in q for w in ["budget", "cheap", "affordable", "low price"]):
        prefs["budget_type"] = "budget"

    if any(w in q for w in ["premium", "flagship", "high end", "high-end"]):
        prefs["budget_type"] = "premium"

    if any(w in q for w in ["phone", "mobile", "smartphone"]):
        prefs["categories"].append("Mobiles")

    if "laptop" in q:
        prefs["categories"].append("Laptop")

    if any(w in q for w in ["earbuds", "earphone", "headphone", "audio"]):
        prefs["categories"].append("Audio")

    if any(w in q for w in ["watch", "smartwatch", "wearable"]):
        prefs["categories"].append("Wearables")

    if any(w in q for w in ["pc", "desktop"]):
        prefs["categories"].append("PC")

    if any(w in q for w in ["charger", "adapter", "cable", "accessory"]):
        prefs["categories"].append("Accessories")

    # Learn from shown products too
    if products:
        for product in products:
            brand = product.get("brand")
            category = product.get("category")

            if brand:
                prefs["brands"].append(brand)

            if category:
                prefs["categories"].append(category)

    return prefs


def merge_preferences(old_prefs, new_prefs):
    old_prefs = old_prefs or {}

    old_brands = old_prefs.get("brands", [])
    old_categories = old_prefs.get("categories", [])

    new_brands = new_prefs.get("brands", [])
    new_categories = new_prefs.get("categories", [])

    return {
        "brands": list(set(old_brands + new_brands)),
        "categories": list(set(old_categories + new_categories)),
        "budget_type": new_prefs.get("budget_type") or old_prefs.get("budget_type")
    }