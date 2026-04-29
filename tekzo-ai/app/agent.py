from app.context_builder import build_context
from app.generator import generate_answer
from app.tools import (
    search_products,
    add_to_cart,
    get_cart,
    compare_products,
    remove_from_cart,
    update_cart_quantity,
    NODE_API_URL
)
from app.decision import decide_action
from app.recommendation import recommend_products


CONFIRMATION_PRICE_LIMIT = 50000


def build_confirmation(message, pending_action, decision, product=None):
    return {
        "success": True,
        "type": "confirmation",
        "message": message,
        "product": product,
        "products": [product] if product else [],
        "tool_used": "confirmation_required",
        "decision": decision,
        "pending_action": pending_action
    }


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


def add_selected_product(
    selected_product,
    user_token,
    decision,
    tool_used="memory_action",
    require_confirmation=True
):
    if require_confirmation and selected_product.get("price", 0) >= CONFIRMATION_PRICE_LIMIT:
        return build_confirmation(
            f"{selected_product['name']} costs ₹{selected_product['price']}. Do you want me to add it to your cart?",
            {
                "type": "ADD_TO_CART",
                "product_id": selected_product["id"],
                "product": selected_product
            },
            decision,
            selected_product
        )

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
            "clear_memory": True,
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

        if category and category in query_lower:
            return item

    return None


def detect_quantity_action(query):
    q = query.lower()

    if "increase" in q or "one more" in q or "add one more" in q:
        return "increment"

    if "decrease" in q or "reduce" in q or "less" in q:
        return "decrement"

    return None


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

    return build_confirmation(
        f"Are you sure you want to remove {selected_item['name']} from your cart?",
        {
            "type": "REMOVE_FROM_CART",
            "product_id": selected_item["id"],
            "product": selected_item
        },
        decision,
        selected_item
    )


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

    action_text = "increase" if quantity_action == "increment" else "decrease"

    return build_confirmation(
        f"Do you want me to {action_text} quantity of {selected_item['name']}?",
        {
            "type": "UPDATE_CART_QUANTITY",
            "product_id": selected_item["id"],
            "quantity_action": quantity_action,
            "product": selected_item
        },
        decision,
        selected_item
    )

def checkout_cart(token):
    import requests

    if not token:
        return {
            "success": False,
            "message": "Login required to checkout."
        }

    try:
        res = requests.post(
            f"{NODE_API_URL}/orders/checkout",
            headers={"Authorization": f"Bearer {token}"}
        )

        if res.status_code == 200:
            return {
                "success": True,
                "message": "Order placed successfully 🎉",
                "data": res.json()
            }

        return {
            "success": False,
            "message": "Checkout failed.",
            "error": res.json()
        }

    except Exception as e:
        return {
            "success": False,
            "message": "Checkout service error.",
            "error": str(e)
        }

def run_agent(query, user_token=None, memory=None):
    decision = decide_action(query)
    query_lower = query.lower().strip()

    # Confirmation response handler
    if memory and memory.get("pending_action"):
        pending = memory["pending_action"]

        if query_lower in ["yes", "confirm", "ok", "okay", "sure"]:
            if pending["type"] == "ADD_TO_CART":
                return add_selected_product(
                    pending["product"],
                    user_token,
                    decision,
                    tool_used="confirmed_add",
                    require_confirmation=False
                )

            if pending["type"] == "REMOVE_FROM_CART":
                remove_result = remove_from_cart(pending["product_id"], user_token)

                if remove_result.get("success"):
                    product_name = pending.get("product", {}).get("name", "Product")

                    return {
                        "success": True,
                        "type": "action",
                        "message": f"{product_name} removed from your cart ✅",
                        "products": [],
                        "tool_used": "confirmed_remove",
                        "clear_memory": True,
                        "action": {
                            "type": "REMOVE_FROM_CART",
                            "product_id": pending["product_id"],
                            "remove_result": remove_result
                        },
                        "decision": decision
                    }
            if pending["type"] == "CHECKOUT":
                checkout_result = checkout_cart(user_token)

                if checkout_result.get("success"):
                    return {
                        "success": True,
                        "type": "action",
                        "message": "Order placed successfully 🎉",
                        "products": [],
                        "clear_memory": True
                    }
            if pending["type"] == "UPDATE_CART_QUANTITY":
                update_result = update_cart_quantity(
                    pending["product_id"],
                    pending["quantity_action"],
                    user_token
                )

                if update_result.get("success"):
                    product_name = pending.get("product", {}).get("name", "Product")
                    action_text = "increased" if pending["quantity_action"] == "increment" else "decreased"

                    return {
                        "success": True,
                        "type": "action",
                        "message": f"{product_name} quantity {action_text} ✅",
                        "products": [],
                        "tool_used": "confirmed_quantity_update",
                        "clear_memory": True,
                        "action": {
                            "type": "UPDATE_CART_QUANTITY",
                            "product_id": pending["product_id"],
                            "update_result": update_result
                        },
                        "decision": decision
                    }

        if query_lower in ["no", "cancel", "stop"]:
            return {
                "success": True,
                "type": "chat",
                "message": "Okay, action cancelled.",
                "products": [],
                "clear_memory": True,
                "tool_used": "confirmation_cancelled",
                "decision": decision
            }

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
    if action == "CHECKOUT":
        cart_result = get_cart(user_token)

        if not cart_result.get("success") or not cart_result.get("items"):
            return {
                "success": False,
                "type": "error",
                "message": "Your cart is empty.",
                "products": [],
                "decision": decision
            }

        # 🔥 Confirmation required
        return {
            "success": True,
            "type": "confirmation",
            "message": f"Your total is ₹{cart_result['total']}. Do you want to place the order?",
            "pending_action": {
                "type": "CHECKOUT"
            },
            "decision": decision
        }

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

        recommendation = recommend_products(query, products, memory)
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