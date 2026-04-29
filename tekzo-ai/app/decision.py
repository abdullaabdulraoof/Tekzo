import json
import ollama


def decide_action(query):
    prompt = f"""
You are an AI shopping assistant.

Your job is to classify the user's intent.

Available actions:

1. SEARCH_PRODUCTS
Use when user wants to list, show, browse, or search products.
Examples:
- "list products"
- "show audio products"
- "show mobiles"
- "find laptops"

2. RECOMMEND_PRODUCTS
Use when user asks for best/suggest/recommend/which product to buy.
Examples:
- "best budget earbuds"
- "recommend phones under 50000"
- "which smartwatch should I buy"
- "suggest gaming laptop"

3. COMPARE_PRODUCTS
Use when user wants comparison.
Examples:
- "compare iphone 16 and samsung s25"
- "iphone 16 vs samsung s25"
- "difference between Nothing ear and OnePlus bullets"

4. ADD_TO_CART
Use when user wants to add or buy something.
Examples:
- "add earbuds to cart"
- "buy cheapest phone"
- "add this to cart"

5. REMOVE_FROM_CART
Use when user wants to remove/delete an item from cart.
Examples:
- "remove earbuds from cart"
- "delete second item from cart"
- "remove Nothing ear"
- "remove this from cart"

6. UPDATE_CART_QUANTITY
Use when user wants to increase, decrease, reduce, or change item quantity in cart.
Examples:
- "increase quantity of iPhone 16"
- "decrease earbuds quantity"
- "make OnePlus quantity 3"
- "add one more iPhone"
- "reduce Nothing ear quantity"

7. GET_CART
Use when user wants to see cart.
Examples:
- "show my cart"
- "what is in my cart"
- "cart items"

8. NORMAL_CHAT
Use for greetings or unrelated messages.
Examples:
- "hello"
- "hi"
- "how are you"

9. CHECKOUT
Use when user wants to place order or buy cart items.
Examples:
- "checkout"
- "place order"
- "buy now"
- "complete purchase"

IMPORTANT RULES:
- If user says "increase", "decrease", "quantity", "one more", "reduce", or "less" → ALWAYS choose UPDATE_CART_QUANTITY
- If user says "remove" OR "delete" → ALWAYS choose REMOVE_FROM_CART
- If user says "add" OR "buy" → ALWAYS choose ADD_TO_CART
- If user says "compare", "vs", or "difference" → choose COMPARE_PRODUCTS
- If user asks "best", "suggest", "recommend", or "which should I buy" → choose RECOMMEND_PRODUCTS
- If user asks cart without add/buy/remove/delete/quantity update → choose GET_CART
- If user says hello/hi/hey → choose NORMAL_CHAT
- If user says list/show/find products → choose SEARCH_PRODUCTS

User query:
{query}

Return ONLY valid JSON:
{{
  "action": "...",
  "reason": "...",
  "needs_search": true/false
}}
"""

    response = ollama.chat(
        model="llama3",
        messages=[{"role": "user", "content": prompt}]
    )

    content = response["message"]["content"]

    try:
        return json.loads(content)
    except Exception:
        q = query.lower()

        if (
            "increase" in q or
            "decrease" in q or
            "quantity" in q or
            "one more" in q or
            "reduce" in q or
            "less" in q
        ):
            return {
                "action": "UPDATE_CART_QUANTITY",
                "reason": "Fallback: user wants to update cart quantity",
                "needs_search": False
            }

        if "remove" in q or "delete" in q:
            return {
                "action": "REMOVE_FROM_CART",
                "reason": "Fallback: user wants to remove item from cart",
                "needs_search": False
            }

        if "add" in q or "buy" in q:
            return {
                "action": "ADD_TO_CART",
                "reason": "Fallback: user wants to add or buy",
                "needs_search": True
            }

        if "cart" in q:
            return {
                "action": "GET_CART",
                "reason": "Fallback: user is asking about cart",
                "needs_search": False
            }

        if "compare" in q or " vs " in q or "difference" in q:
            return {
                "action": "COMPARE_PRODUCTS",
                "reason": "Fallback: user wants product comparison",
                "needs_search": True
            }

        if "recommend" in q or "suggest" in q or "best" in q or "which" in q:
            return {
                "action": "RECOMMEND_PRODUCTS",
                "reason": "Fallback: user wants product recommendation",
                "needs_search": True
            }

        if "list" in q or "show" in q or "find" in q or "products" in q:
            return {
                "action": "SEARCH_PRODUCTS",
                "reason": "Fallback: user wants to search/list products",
                "needs_search": True
            }

        if q.strip() in ["hello", "hi", "hey"]:
            return {
                "action": "NORMAL_CHAT",
                "reason": "Fallback: greeting",
                "needs_search": False
            }

        if "checkout" in q or "order" in q or "buy now" in q:
            return {
                "action": "CHECKOUT",
                "reason": "User wants to place order",
                "needs_search": False
            }

        return {
            "action": "NORMAL_CHAT",
            "reason": "Fallback: general chat",
            "needs_search": False
        }