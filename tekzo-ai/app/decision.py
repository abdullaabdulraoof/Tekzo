import json
import re
import ollama


def decide_action(query):
    prompt = f"""
You are an AI shopping assistant.

Your job is to classify the user's intent.

Available actions:

1. SEARCH_PRODUCTS
2. RECOMMEND_PRODUCTS
3. COMPARE_PRODUCTS
4. ADD_TO_CART
5. REMOVE_FROM_CART
6. UPDATE_CART_QUANTITY
7. GET_CART
8. CHECKOUT
9. OPTIMIZE_CART
10. APPLY_CART_OPTIMIZATION
11. NORMAL_CHAT
12. TRACK_ORDER
13. CANCEL_ORDER
14. RETURN_ORDER
15. LOW_STOCK_PRODUCTS
16. TOP_SELLING_PRODUCTS
17. DEAD_STOCK_PRODUCTS

IMPORTANT RULES:
- APPLY_CART_OPTIMIZATION → highest priority
- OPTIMIZE_CART → second priority
- TRACK_ORDER → third priority
- CANCEL_ORDER / RETURN_ORDER → after tracking
- CHECKOUT → next
- UPDATE_CART_QUANTITY
- REMOVE_FROM_CART
- ADD_TO_CART
- COMPARE_PRODUCTS
- RECOMMEND_PRODUCTS
- GET_CART
- SEARCH_PRODUCTS
- If user says "low stock" → LOW_STOCK_PRODUCTS
- If user says "top selling" or "best selling" → TOP_SELLING_PRODUCTS
- If user says "not selling" or "dead stock" → DEAD_STOCK_PRODUCTS
- NORMAL_CHAT last

User query:
{query}

Return ONLY valid JSON:
{{
  "action": "...",
  "reason": "...",
  "needs_search": true/false
}}
"""

    try:
        response = ollama.chat(
            model="llama3",
            messages=[{"role": "user", "content": prompt}]
        )

        content = response["message"]["content"]
        return json.loads(content)

    except Exception:
        pass  # fallback logic below


    # ==============================
    # 🔥 FALLBACK LOGIC (PRIORITY ORDER)
    # ==============================

    q = query.lower().strip()

    # ------------------------------
    # APPLY CART OPTIMIZATION
    # ------------------------------
    if any(x in q for x in [
        "apply suggestion",
        "apply first",
        "apply second",
        "apply third",
        "replace first",
        "replace second",
        "replace third",
        "use cheaper",
        "apply cheaper",
        "replace "
    ]):
        return {
            "action": "APPLY_CART_OPTIMIZATION",
            "reason": "User wants to apply optimization",
            "needs_search": False
        }

    # ------------------------------
    # OPTIMIZE CART
    # ------------------------------
    if any(x in q for x in [
        "optimize",
        "make my cart cheaper",
        "reduce cart",
        "cheaper alternative",
        "reduce total",
        "save money"
    ]):
        return {
            "action": "OPTIMIZE_CART",
            "reason": "User wants cheaper cart",
            "needs_search": False
        }

    # ------------------------------
    # TRACK ORDER (HIGH PRIORITY)
    # ------------------------------
    if (
        "track order" in q or
        "order status" in q or
        "where is my order" in q or
        "latest order" in q or
        "my order" in q or
        "order id" in q or
        re.search(r"order\s*\d+", q)
    ):
        return {
            "action": "TRACK_ORDER",
            "reason": "User wants to track order",
            "needs_search": False
        }

    # ------------------------------
    # CANCEL ORDER
    # ------------------------------
    if any(x in q for x in [
        "cancel order",
        "cancel my order",
        "cancel this order"
    ]):
        return {
            "action": "CANCEL_ORDER",
            "reason": "User wants to cancel order",
            "needs_search": False
        }

    # ------------------------------
    # RETURN ORDER
    # ------------------------------
    if any(x in q for x in [
        "return order",
        "return my order",
        "return this order"
    ]):
        return {
            "action": "RETURN_ORDER",
            "reason": "User wants to return order",
            "needs_search": False
        }

    # ------------------------------
    # CHECKOUT
    # ------------------------------
    if any(x in q for x in [
        "checkout",
        "place order",
        "complete purchase",
        "buy everything"
    ]):
        return {
            "action": "CHECKOUT",
            "reason": "User wants checkout",
            "needs_search": False
        }

    # ------------------------------
    # UPDATE QUANTITY
    # ------------------------------
    if any(x in q for x in [
        "increase",
        "decrease",
        "quantity",
        "one more",
        "reduce",
        "less"
    ]):
        return {
            "action": "UPDATE_CART_QUANTITY",
            "reason": "User wants quantity change",
            "needs_search": False
        }

    # ------------------------------
    # REMOVE FROM CART
    # ------------------------------
    if "remove" in q or "delete" in q:
        return {
            "action": "REMOVE_FROM_CART",
            "reason": "User wants to remove item",
            "needs_search": False
        }

    # ------------------------------
    # ADD TO CART
    # ------------------------------
    if "add" in q or "buy" in q:
        return {
            "action": "ADD_TO_CART",
            "reason": "User wants to add/buy",
            "needs_search": True
        }

    # ------------------------------
    # COMPARE
    # ------------------------------
    if "compare" in q or " vs " in q or "difference" in q:
        return {
            "action": "COMPARE_PRODUCTS",
            "reason": "User wants comparison",
            "needs_search": True
        }

    # ------------------------------
    # RECOMMEND
    # ------------------------------
    if any(x in q for x in ["recommend", "suggest", "best", "which"]):
        return {
            "action": "RECOMMEND_PRODUCTS",
            "reason": "User wants recommendation",
            "needs_search": True
        }

    # ------------------------------
    # GET CART
    # ------------------------------
    if "cart" in q:
        return {
            "action": "GET_CART",
            "reason": "User asking cart",
            "needs_search": False
        }

    # ------------------------------
    # LOW STOCK PRODUCTS (Admin)
    # ------------------------------
    if "low stock" in q:
        return {
            "action": "LOW_STOCK_PRODUCTS",
            "reason": "Admin wants low stock products",
            "needs_search": False
        }

    # ------------------------------
    # TOP SELLING PRODUCTS (Admin)
    # ------------------------------
    if "top selling" in q or "best selling" in q:
        return {
            "action": "TOP_SELLING_PRODUCTS",
            "reason": "Admin wants top selling products",
            "needs_search": False
        }

    # ------------------------------
    # DEAD STOCK PRODUCTS (Admin)
    # ------------------------------
    if "not selling" in q or "dead stock" in q:
        return {
            "action": "DEAD_STOCK_PRODUCTS",
            "reason": "Admin wants non-selling products",
            "needs_search": False
        }

    # ------------------------------
    # SEARCH PRODUCTS
    # ------------------------------
    if any(x in q for x in ["list", "show", "find", "products"]):
        return {
            "action": "SEARCH_PRODUCTS",
            "reason": "User searching products",
            "needs_search": True
        }

    # ------------------------------
    # NORMAL CHAT
    # ------------------------------
    if q in ["hello", "hi", "hey"]:
        return {
            "action": "NORMAL_CHAT",
            "reason": "Greeting",
            "needs_search": False
        }

    return {
        "action": "NORMAL_CHAT",
        "reason": "Default fallback",
        "needs_search": False
    }