# # from app.retriever import retrieve
# # from app.context_builder import build_context
# # from app.generator import generate_answer
# # from app.tools import add_to_cart, get_cheapest

# # def run_agent(query, user_token=None):
# #     query_lower = query.lower()

# #     # Step 1: Retrieve products
# #     products = retrieve(query)

# #     if not products:
# #         return {
# #             "type": "chat",
# #             "message": "I couldn't find any matching products.",
# #             "products": []
# #         }

# #     # Step 2: Cheapest flow
# #     if "cheapest" in query_lower:
# #         cheapest = get_cheapest(products)
# #         return {
# #             "type": "action",
# #             "message": f"Cheapest option is {cheapest['metadata']['brand']} at ₹{cheapest['metadata']['price']}",
# #             "product": cheapest,
# #             "products": products
# #         }

# #     # Step 3: Add to cart / buy flow
# #     if "add" in query_lower or "buy" in query_lower:
# #         best_product = products[0]

# #         cart_result = add_to_cart(best_product["metadata"]["id"], user_token)

# #         return {
# #             "type": "action",
# #             "message": f"{best_product['metadata']['brand']} product added to your cart ✅",
# #             "product": best_product,
# #             "products": products,
# #             "action": {
# #                 "type": "ADD_TO_CART",
# #                 "product_id": best_product["metadata"]["id"],
# #                 "cart_result": cart_result
# #             }
# #         }

# #     # Step 4: Default normal RAG response
# #     context = build_context(products)
# #     answer = generate_answer(query, context)

# #     return {
# #         "type": "chat",
# #         "message": answer,
# #         "products": products
# #     }



# from app.context_builder import build_context
# from app.generator import generate_answer
# from app.tools import search_products, add_to_cart


# def run_agent(query, user_token=None):
#     query_lower = query.lower()

#     # Step 1: Search products using Tool 1
#     products = search_products(query)

#     if not products:
#         return {
#             "success": False,
#             "type": "chat",
#             "message": "I couldn't find any matching products.",
#             "products": [],
#             "tool_used": "search_products"
#         }

#     wants_add = any(word in query_lower for word in ["add", "buy", "cart"])
#     wants_cheapest = any(word in query_lower for word in ["cheapest", "lowest", "low price"])

#     # Step 2: Add to cart flow
#     if wants_add:
#         selected_product = products[0]

#         # If user asks cheapest, choose lowest priced product
#         if wants_cheapest:
#             selected_product = min(products, key=lambda p: p.get("price", 0))

#         cart_result = add_to_cart(selected_product["id"], user_token)

#         if cart_result.get("success"):
#             return {
#                 "success": True,
#                 "type": "action",
#                 "message": f"{selected_product['name']} added to your cart ✅",
#                 "product": selected_product,
#                 "products": [selected_product],
#                 "tool_used": "add_to_cart",
#                 "action": {
#                     "type": "ADD_TO_CART",
#                     "product_id": selected_product["id"],
#                     "cart_result": cart_result
#                 }
#             }

#         return {
#             "success": False,
#             "type": "error",
#             "message": cart_result.get("message", "Could not add product to cart."),
#             "product": selected_product,
#             "products": [selected_product],
#             "tool_used": "add_to_cart",
#             "action": {
#                 "type": "ADD_TO_CART",
#                 "product_id": selected_product["id"],
#                 "cart_result": cart_result
#             }
#         }

#     # Step 3: Cheapest display flow
#     if wants_cheapest:
#         cheapest = min(products, key=lambda p: p.get("price", 0))

#         return {
#             "success": True,
#             "type": "chat",
#             "message": f"Cheapest option is {cheapest['name']} at ₹{cheapest['price']}.",
#             "product": cheapest,
#             "products": [cheapest],
#             "tool_used": "search_products"
#         }

#     # Step 4: Default RAG answer
#     context = build_context(products)
#     answer = generate_answer(query, context)

#     return {
#         "success": True,
#         "type": "chat",
#         "message": answer,
#         "products": products,
#         "tool_used": "search_products"
#     }