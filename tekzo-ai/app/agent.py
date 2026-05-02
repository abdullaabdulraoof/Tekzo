from app.context_builder import build_context
from app.generator import generate_answer
from app.tools import (
    search_products,
    add_to_cart,
    get_cart,
    compare_products,
    remove_from_cart,
    update_cart_quantity,
    get_orders,
    cancel_order,
    return_order,
    get_low_stock,
    get_top_selling,
    get_dead_stock,
)
from app.decision import decide_action
from app.recommendation import recommend_products

CONFIRMATION_PRICE_LIMIT = 50000


def get_id(obj):
    return obj.get("id") or obj.get("_id")


def build_confirmation(message, pending_action, decision, product=None):
    return {
        "success": True,
        "type": "confirmation",
        "message": message,
        "products": [product] if product else [],
        "pending_action": pending_action,
        "tool_used": "confirmation_required",
        "decision": decision
    }


def get_memory_selected_product(query, memory):
    if not memory or "last_products" not in memory:
        return None

    products = memory.get("last_products", [])
    q = query.lower()

    if not products:
        return None

    if "second" in q and len(products) > 1:
        return products[1]
    if "third" in q and len(products) > 2:
        return products[2]
    if "last" in q:
        return products[-1]

    return products[0]


def get_suggestion_from_memory(query, memory):
    if not memory or "last_optimization_suggestions" not in memory:
        return None

    suggestions = memory.get("last_optimization_suggestions", [])
    q = query.lower()

    if not suggestions:
        return None

    if "second" in q and len(suggestions) > 1:
        return suggestions[1]
    if "third" in q and len(suggestions) > 2:
        return suggestions[2]

    return suggestions[0]


def get_selected_order(query, orders):
    q = query.lower()

    if not orders:
        return None

    if "second" in q and len(orders) > 1:
        return orders[1]

    if "third" in q and len(orders) > 2:
        return orders[2]

    return orders[0]


def track_order(token, decision):
    result = get_orders(token)

    if not result.get("success"):
        return {
            "success": False,
            "type": "error",
            "message": result.get("message", "Could not fetch orders."),
            "decision": decision
        }

    orders = result.get("orders", [])

    if not orders:
        return {
            "success": True,
            "type": "order_tracking",
            "message": "You don’t have any orders yet.",
            "orders": [],
            "decision": decision
        }

    latest = orders[0]

    status = latest.get("status", "unknown")
    total = latest.get("totalAmount", 0)
    payment = latest.get("paymentMethod", "N/A")

    items = latest.get("products", [])
    item_text = ", ".join([
        f"{p.get('product', {}).get('name', 'Item')} x{p.get('quantity', 1)}"
        for p in items[:3]
    ])

    return {
        "success": True,
        "type": "order_tracking",
        "message": (
            f"Your latest order is {status}.\n"
            f"Total: ₹{total}\n"
            f"Payment: {payment}\n"
            f"Items: {item_text}"
        ),
        "order": latest,
        "orders": orders[:1],
        "tool_used": "track_order",
        "decision": decision
    }


def cancel_order_flow(query, token, decision):
    result = get_orders(token)

    if not result.get("success"):
        return {
            "success": False,
            "type": "error",
            "message": "Unable to fetch orders.",
            "decision": decision
        }

    order = get_selected_order(query, result.get("orders", []))

    if not order:
        return {
            "success": False,
            "type": "error",
            "message": "No order found to cancel.",
            "decision": decision
        }

    status = str(order.get("status", "")).lower()

    if status in ["shipped", "delivered", "cancelled", "returned"]:
        return {
            "success": False,
            "type": "chat",
            "message": f"This order cannot be cancelled because it is already {status}.",
            "decision": decision
        }

    return build_confirmation(
        f"Are you sure you want to cancel order {order.get('_id')}?",
        {
            "type": "CANCEL_ORDER",
            "order_id": order.get("_id"),
            "order": order
        },
        decision
    )


def return_order_flow(query, token, decision):
    result = get_orders(token)

    if not result.get("success"):
        return {
            "success": False,
            "type": "error",
            "message": "Unable to fetch orders.",
            "decision": decision
        }

    order = get_selected_order(query, result.get("orders", []))

    if not order:
        return {
            "success": False,
            "type": "error",
            "message": "No order found to return.",
            "decision": decision
        }

    status = str(order.get("status", "")).lower()

    if status != "delivered":
        return {
            "success": False,
            "type": "chat",
            "message": "Only delivered orders can be returned.",
            "decision": decision
        }

    return build_confirmation(
        f"Do you want to return order {order.get('_id')}?",
        {
            "type": "RETURN_ORDER",
            "order_id": order.get("_id"),
            "order": order
        },
        decision
    )


# =========================================
# 🔹 ADMIN INVENTORY INTELLIGENCE (Phase 27)
# =========================================

def low_stock_products(token, decision):
    result = get_low_stock(token)
    if not result.get("success"):
        return {
            "success": False,
            "type": "error",
            "message": "Could not fetch low stock products.",
            "decision": decision
        }
    products = result.get("products", [])
    if not products:
        return {
            "success": True,
            "type": "chat",
            "message": "No low stock products found.",
            "products": [],
            "decision": decision
        }
    return {
        "success": True,
        "type": "admin_products",
        "message": "Here are your low stock products:",
        "products": products,
        "tool_used": "low_stock",
        "decision": decision
    }


def top_selling_products(token, decision):
    result = get_top_selling(token)
    if not result.get("success"):
        return {
            "success": False,
            "type": "error",
            "message": "Could not fetch top selling products.",
            "decision": decision
        }
    products = result.get("products", [])
    return {
        "success": True,
        "type": "admin_products",
        "message": "🔥 Top selling products:",
        "products": products,
        "tool_used": "top_selling",
        "decision": decision
    }


def dead_stock_products(token, decision):
    result = get_dead_stock(token)
    if not result.get("success"):
        return {
            "success": False,
            "type": "error",
            "message": "Could not fetch dead stock products.",
            "decision": decision
        }
    products = result.get("products", [])
    return {
        "success": True,
        "type": "admin_products",
        "message": "⚠️ These products are not selling:",
        "products": products,
        "tool_used": "dead_stock",
        "decision": decision
    }


def add_selected_product(product, token, decision, require_confirmation=True):
    pid = get_id(product)

    if not pid:
        return {"success": False, "type": "error", "message": "Invalid product"}

    if not product.get("inStock", True) or product.get("stock", 1) <= 0:
        return {
            "success": False,
            "type": "error",
            "message": f"{product.get('name', 'This product')} is currently out of stock.",
            "products": [],
            "tool_used": "stock_check",
            "decision": decision
        }

    if require_confirmation and product.get("price", 0) >= CONFIRMATION_PRICE_LIMIT:
        return build_confirmation(
            f"{product['name']} costs ₹{product['price']}. Add to cart?",
            {"type": "ADD_TO_CART", "product_id": pid, "product": product},
            decision,
            product
        )

    result = add_to_cart(pid, token)

    if result.get("success"):
        return {
            "success": True,
            "type": "action",
            "message": f"{product['name']} added to cart ✅",
            "products": [product],
            "clear_memory": True,
            "decision": decision,
            "tool_used": "add_to_cart"
        }

    return {
        "success": False,
        "type": "error",
        "message": result.get("message", "Failed to add to cart"),
        "decision": decision
    }


def start_checkout(token, decision):
    cart = get_cart(token)

    if not cart.get("success"):
        return {"success": False, "type": "error", "message": "Cart error"}

    items = cart.get("items", [])
    total = cart.get("total", 0)

    if not items:
        return {"success": False, "type": "error", "message": "Cart empty"}

    return {
        "success": True,
        "type": "checkout",
        "message": f"Cart total ₹{total}. Continue checkout.",
        "cart": {"items": items, "total": total},
        "checkout": {"url": "/checkout/cart", "total": total},
        "tool_used": "checkout",
        "decision": decision
    }


def optimize_cart(token, decision):
    cart = get_cart(token)

    if not cart.get("success"):
        return {"success": False, "type": "error", "message": "Cart error"}

    items = cart.get("items", [])

    if not items:
        return {"success": False, "type": "chat", "message": "Cart empty"}

    suggestions = []
    alt_products = []

    for item in items:
        category = item.get("category")
        price = item.get("price", 0)

        alternatives = search_products(f"budget {category}")

        cheaper = [
            p for p in alternatives
            if p.get("inStock", True)
            and p.get("stock", 1) > 0
            and p.get("price", 0) < price
        ]

        if cheaper:
            best = sorted(cheaper, key=lambda x: x["price"])[0]

            suggestions.append({
                "current": item,
                "alternative": best,
                "saving": price - best["price"]
            })

            alt_products.append(best)

    if not suggestions:
        return {
            "success": True,
            "type": "cart_optimization",
            "message": "No better alternatives found.",
            "suggestions": [],
            "tool_used": "optimize_cart",
            "decision": decision
        }

    msg = "Here are cheaper options:\n"
    for s in suggestions[:3]:
        msg += f"\nReplace {s['current']['name']} → {s['alternative']['name']} (Save ₹{s['saving']})"

    msg += "\n\nSay 'apply first suggestion'"

    return {
        "success": True,
        "type": "cart_optimization",
        "message": msg,
        "products": alt_products[:3],
        "suggestions": suggestions[:3],
        "last_optimization_suggestions": suggestions[:3],
        "tool_used": "optimize_cart",
        "decision": decision
    }


def apply_optimization(query, token, decision, memory):
    s = get_suggestion_from_memory(query, memory)

    if not s:
        return {"success": False, "type": "error", "message": "No suggestion found"}

    return build_confirmation(
        f"Replace {s['current']['name']} with {s['alternative']['name']}?",
        {
            "type": "APPLY_CART_OPTIMIZATION",
            "current_product_id": get_id(s["current"]),
            "alternative_product_id": get_id(s["alternative"]),
            "saving": s["saving"]
        },
        decision,
        s["alternative"]
    )


def run_agent(query, token=None, memory=None):
    decision = decide_action(query)
    action = decision.get("action")
    q = query.lower().strip()

    if memory and memory.get("pending_action"):
        p = memory["pending_action"]

        if q in ["yes", "confirm", "ok", "okay", "sure"]:
            if p["type"] == "ADD_TO_CART":
                return add_selected_product(p["product"], token, decision, False)

            if p["type"] == "APPLY_CART_OPTIMIZATION":
                remove_result = remove_from_cart(p["current_product_id"], token)
                add_result = add_to_cart(p["alternative_product_id"], token)

                if add_result.get("success"):
                    return {
                        "success": True,
                        "type": "action",
                        "message": "Cart optimized ✅",
                        "clear_memory": True,
                        "clear_optimization_memory": True,
                        "action": {
                            "type": "APPLY_CART_OPTIMIZATION",
                            "remove_result": remove_result,
                            "add_result": add_result
                        },
                        "decision": decision
                    }

                return {
                    "success": False,
                    "type": "error",
                    "message": "Could not apply optimization.",
                    "decision": decision
                }

            if p["type"] == "CANCEL_ORDER":
                result = cancel_order(p["order_id"], token)

                if result.get("success"):
                    return {
                        "success": True,
                        "type": "action",
                        "message": "Order cancelled successfully ✅",
                        "clear_memory": True,
                        "tool_used": "cancel_order",
                        "decision": decision
                    }

                return {
                    "success": False,
                    "type": "error",
                    "message": result.get("message", "Could not cancel order."),
                    "clear_memory": True,
                    "tool_used": "cancel_order",
                    "decision": decision
                }

            if p["type"] == "RETURN_ORDER":
                result = return_order(p["order_id"], token)

                if result.get("success"):
                    return {
                        "success": True,
                        "type": "action",
                        "message": "Return request placed successfully ✅",
                        "clear_memory": True,
                        "tool_used": "return_order",
                        "decision": decision
                    }

                return {
                    "success": False,
                    "type": "error",
                    "message": result.get("message", "Could not place return request."),
                    "clear_memory": True,
                    "tool_used": "return_order",
                    "decision": decision
                }

        if q in ["no", "cancel", "stop"]:
            return {
                "success": True,
                "type": "chat",
                "message": "Cancelled",
                "clear_memory": True,
                "decision": decision
            }

    if action == "TRACK_ORDER":
        return track_order(token, decision)

    if action == "CANCEL_ORDER":
        return cancel_order_flow(query, token, decision)

    if action == "RETURN_ORDER":
        return return_order_flow(query, token, decision)

    if action == "LOW_STOCK_PRODUCTS":
        return low_stock_products(token, decision)

    if action == "TOP_SELLING_PRODUCTS":
        return top_selling_products(token, decision)

    if action == "DEAD_STOCK_PRODUCTS":
        return dead_stock_products(token, decision)

    if action == "CHECKOUT":
        return start_checkout(token, decision)

    if action == "OPTIMIZE_CART":
        return optimize_cart(token, decision)

    if action == "APPLY_CART_OPTIMIZATION":
        return apply_optimization(query, token, decision, memory)

    if action == "GET_CART":
        cart = get_cart(token)

        items = cart.get("items", [])
        total = cart.get("total", 0)

        return {
            "success": cart.get("success", True),
            "type": "cart",
            "message": f"Total ₹{total}",
            "cart": {"items": items, "total": total},
            "checkout": {"url": "/checkout/cart", "total": total} if items else None,
            "tool_used": "get_cart",
            "decision": decision
        }

    products = search_products(query)

    if action == "ADD_TO_CART":
        if not products:
            return {"success": False, "type": "error", "message": "No product found"}

        rec = recommend_products(query, products, memory)
        return add_selected_product(rec["products"][0], token, decision)

    if action == "RECOMMEND_PRODUCTS":
        rec = recommend_products(query, products, memory)

        return {
            "success": True,
            "type": "recommendation",
            "message": rec["message"],
            "products": rec["products"],
            "preferences": rec["preferences"],
            "tool_used": "recommendation_engine",
            "decision": decision
        }

    if action == "COMPARE_PRODUCTS":
        result = compare_products(query)
        return {"success": True, "type": "comparison", **result}

    context = build_context(products)
    answer = generate_answer(query, context)

    return {
        "success": True,
        "type": "chat",
        "message": answer,
        "products": products,
        "tool_used": "normal_chat",
        "decision": decision
    }