def build_context(results):
    context = ""

    for item in results:
        name = item.get("name", "")
        brand = item.get("brand", "")
        tag = item.get("tag", "")
        category = item.get("category", "")
        price = item.get("price", "")
        summary = item.get("summary", "")

        context += f"""
{name} by {brand}.
Category: {category}.
Tag: {tag}.
Price: ₹{price}.
Description: {summary}.
"""

    return context.strip()