from app.context_builder import build_context
from app.generator import generate_answer
from app.tools import search_products, add_to_cart, get_cart, compare_products, remove_from_cart, update_cart_quantity
from app.decision import decide_action
from app.recommendation import recommend_products


CONFIRMATION_PRICE_LIMIT = 50000


def get_memory_selected_product(query, memory):
    if not memory or "last_products" not in memory:
        return None

    query_lower = query.lower()
    last_products = memory.get("last_products", [])

    if not last_products:
        return None

    if "first" in query_lower or "this" in query_lower or "that" in query_lower:
        return last_products[0]

    if "second" in query_lower and len(last_products) > 1:
        return last_products[1]

    if "third" in query_lower and len(last_products) > 2:
        return last_products[2]

    if "last" in query_lower:
        return last_products[-1]

    return None


def add_selected_product(selected_product, user_token, decision, tool_used="memory_action"):
    if selected_product.get("price", 0) >= CONFIRMATION_PRICE_LIMIT:
        return {
            "success": True,
            "type": "confirmation",
            "message": (
                f"{selected_product['name']} costs ₹{selected_product['price']}. "
                f"Do you want me to add it to your cart?"
            ),
            "product": selected_product,
            "products": [selected_product],
            "tool_used": "confirmation_required",
            "decision": decision,
            "pending_action": {
                "type": "ADD_TO_CART",
                "product_id": selected_product["id"],
                "product": selected_product
            }
        }

    cart_result = add_to_cart(selected_product["id"], user_token)

    if cart_result.get("success"):
        return {
            "success": True,
            "type": "action",
            "message": f"{selected_product['name']} added to your cart ✅",
            "product": selected_product,
            "products": [selected_product],
            "tool_used": tool_used,
            "decision": decision,
            "action": {
                "type": "ADD_TO_CART",
                "product_id": selected_product["id"],
                "cart_result": cart_result
            }
        }

    return {
        "success": False,
        "type": "error",
        "message": cart_result.get("message", "Could not add product to cart."),
        "product": selected_product,
        "products": [selected_product],
        "tool_used": tool_used,
        "decision": decision
    }


def get_cart_selected_item(query, cart_items):
    query_lower = query.lower()

    if not cart_items:
        return None

    if "first" in query_lower:
        return cart_items[0]

    if "second" in query_lower and len(cart_items) > 1:
        return cart_items[1]

    if "third" in query_lower and len(cart_items) > 2:
        return cart_items[2]

    if "last" in query_lower:
        return cart_items[-1]

    for item in cart_items:
        name = item.get("name", "").lower()
        brand = item.get("brand", "").lower()
        category = item.get("category", "").lower()

        if name and name in query_lower:
            return item

        if brand and brand in query_lower:
            return item

        if category and category.lower() in query_lower:
            return item

    return None
def detect_quantity_action(query):
    q = query.lower()

    if "increase" in q or "one more" in q or "add one more" in q:
        return "increment"

    if "decrease" in q or "reduce" in q or "less" in q:
        return "decrement"

    return None


def update_selected_cart_quantity(query, user_token, decision):
    cart_result = get_cart(user_token)

    if not cart_result.get("success"):
        return {
            "success": False,
            "type": "error",
            "message": cart_result.get("message", "Could not fetch cart."),
            "products": [],
            "tool_used": "get_cart",
            "action_status": cart_result,
            "decision": decision
        }

    cart_items = cart_result.get("items", [])
    selected_item = get_cart_selected_item(query, cart_items)

    if not selected_item:
        return {
            "success": False,
            "type": "error",
            "message": "I couldn't identify which cart item quantity to update.",
            "cart": {
                "items": cart_items,
                "total": cart_result.get("total", 0)
            },
            "products": [],
            "tool_used": "update_cart_quantity",
            "decision": decision
        }

    quantity_action = detect_quantity_action(query)

    if not quantity_action:
        return {
            "success": False,
            "type": "error",
            "message": "Please tell me whether to increase or decrease the quantity.",
            "products": [],
            "tool_used": "update_cart_quantity",
            "decision": decision
        }

    update_result = update_cart_quantity(
        selected_item["id"],
        quantity_action,
        user_token
    )

    if update_result.get("success"):
        action_text = "increased" if quantity_action == "increment" else "decreased"

        return {
            "success": True,
            "type": "action",
            "message": f"{selected_item['name']} quantity {action_text} ✅",
            "products": [],
            "tool_used": "update_cart_quantity",
            "action": {
                "type": "UPDATE_CART_QUANTITY",
                "product_id": selected_item["id"],
                "quantity_action": quantity_action,
                "update_result": update_result
            },
            "decision": decision
        }

    return {
        "success": False,
        "type": "error",
        "message": update_result.get("message", "Could not update cart quantity."),
        "products": [],
        "tool_used": "update_cart_quantity",
        "action_status": update_result,
        "decision": decision
    }

def remove_selected_cart_item(query, user_token, decision):
    cart_result = get_cart(user_token)

    if not cart_result.get("success"):
        return {
            "success": False,
            "type": "error",
            "message": cart_result.get("message", "Could not fetch cart."),
            "products": [],
            "tool_used": "get_cart",
            "action_status": cart_result,
            "decision": decision
        }

    cart_items = cart_result.get("items", [])

    selected_item = get_cart_selected_item(query, cart_items)

    if not selected_item:
        return {
            "success": False,
            "type": "error",
            "message": "I couldn't identify which cart item to remove.",
            "cart": {
                "items": cart_items,
                "total": cart_result.get("total", 0)
            },
            "products": [],
            "tool_used": "remove_from_cart",
            "decision": decision
        }

    remove_result = remove_from_cart(selected_item["id"], user_token)

    if remove_result.get("success"):
        return {
            "success": True,
            "type": "action",
            "message": f"{selected_item['name']} removed from your cart ✅",
            "products": [],
            "tool_used": "remove_from_cart",
            "action": {
                "type": "REMOVE_FROM_CART",
                "product_id": selected_item["id"],
                "remove_result": remove_result
            },
            "decision": decision
        }

    return {
        "success": False,
        "type": "error",
        "message": remove_result.get("message", "Could not remove product from cart."),
        "products": [],
        "tool_used": "remove_from_cart",
        "action_status": remove_result,
        "decision": decision
    }

def run_agent(query, user_token=None, memory=None):
    decision = decide_action(query)

    action = decision.get("action", "SEARCH_PRODUCTS")
    needs_search = decision.get("needs_search", True)

    products = []

    if action == "ADD_TO_CART":
        selected_from_memory = get_memory_selected_product(query, memory)

        if selected_from_memory:
            return add_selected_product(
                selected_from_memory,
                user_token,
                decision,
                tool_used="memory_action"
            )

    if action == "REMOVE_FROM_CART":
        return remove_selected_cart_item(query, user_token, decision)
    if action == "UPDATE_CART_QUANTITY":
        return update_selected_cart_quantity(query, user_token, decision)   

    if needs_search or action in [
        "SEARCH_PRODUCTS",
        "ADD_TO_CART",
        "COMPARE_PRODUCTS",
        "RECOMMEND_PRODUCTS"
    ]:
        products = search_products(query)

    # Add to cart flow with recommendation engine
    if action == "ADD_TO_CART":

        if not products:
            return {
                "success": False,
                "type": "error",
                "message": "I couldn't find a product to add to your cart.",
                "products": [],
                "tool_used": "search_products",
                "decision": decision
            }

        recommendation = recommend_products(query, products)
        recommended_products = recommendation.get("products", [])

        if not recommended_products:
            return {
                "success": False,
                "type": "error",
                "message": "Couldn't determine the best product to add.",
                "products": products,
                "tool_used": "recommendation_engine",
                "decision": decision
            }

        selected_product = recommended_products[0]

        return add_selected_product(
            selected_product,
            user_token,
            decision,
            tool_used="multi_step_agent"
        )

    # Cart flow
    if action == "GET_CART":
        cart_result = get_cart(user_token)

        if not cart_result.get("success"):
            return {
                "success": False,
                "type": "error",
                "message": cart_result.get("message", "Could not fetch cart."),
                "products": [],
                "tool_used": "get_cart",
                "action_status": cart_result,
                "decision": decision
            }

        items = cart_result.get("items", [])
        total = cart_result.get("total", 0)

        if not items:
            message = "Your cart is currently empty."
        else:
            item_names = ", ".join([item["name"] for item in items[:3]])
            message = (
                f"You have {len(items)} item(s) in your cart. "
                f"Total cart value is ₹{total}. Top items: {item_names}."
            )

        return {
            "success": True,
            "type": "cart",
            "message": message,
            "cart": {
                "items": items,
                "total": total
            },
            "products": [],
            "tool_used": "get_cart",
            "decision": decision
        }

    # Recommendation flow
    if action == "RECOMMEND_PRODUCTS":
        if not products:
            return {
                "success": False,
                "type": "recommendation",
                "message": "I couldn't find any suitable products.",
                "products": [],
                "tool_used": "recommendation_engine",
                "decision": decision
            }

        recommendation = recommend_products(query, products)

        return {
            "success": True,
            "type": "recommendation",
            "message": recommendation["message"],
            "products": recommendation["products"],
            "preferences": recommendation["preferences"],
            "tool_used": "recommendation_engine",
            "decision": decision
        }

    # Product comparison flow
    if action == "COMPARE_PRODUCTS":
        compare_result = compare_products(query)

        return {
            "success": compare_result.get("success", False),
            "type": "comparison",
            "message": compare_result.get("message"),
            "products": compare_result.get("products", []),
            "tool_used": "compare_products",
            "decision": decision
        }

    # Product search flow
    if action == "SEARCH_PRODUCTS":
        if not products:
            return {
                "success": False,
                "type": "chat",
                "message": "I couldn't find any matching products.",
                "products": [],
                "tool_used": "search_products",
                "decision": decision
            }

        context = build_context(products)
        answer = generate_answer(query, context)

        return {
            "success": True,
            "type": "chat",
            "message": answer,
            "products": products,
            "tool_used": "search_products",
            "decision": decision
        }

    return {
        "success": True,
        "type": "chat",
        "message": "I can help you find products, compare options, or add items to your cart.",
        "products": [],
        "tool_used": "normal_chat",
        "decision": decision
    }