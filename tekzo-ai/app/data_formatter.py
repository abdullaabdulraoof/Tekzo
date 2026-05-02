def format_product(product):
    name = product.get("name", "")
    brand = product.get("brandName", "")
    category = product.get("category", "")
    price = product.get("price", "")
    desc = product.get("desc", "")
    tag = product.get("tag", "")

    content = f"""
    {name} by {brand}.

    Category: {category}.
    Price: {price}.

    Description:
    {desc}

    Keywords:
    {tag}, {category}, {name}, {brand}

    Product Type:
    {tag}

    This is a {tag} product suitable for users looking for {tag}.
    """

    return {
        "content": content.strip(),
        "metadata": {
            "id": str(product["_id"]),
            "price": price,
            "category": category,
            "brand": brand,
            "tag": tag,
            "stock": product.get("stock") or product.get("quantity") or 10,
            "isAvailable": product.get("isAvailable", True),
            "images": product.get("images", [])
        }
    }