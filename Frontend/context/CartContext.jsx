// context/CartContext.js
import { createContext, useContext, useEffect, useState } from "react";


const CartContext = createContext();

export const CartProvider = ({ children }) => {

    const token = localStorage.getItem("userToken")
    const [cart, setCart] = useState(null)
    const [cartCount, setCartCount] = useState(0);

    const fetchCart = async () => {
        if (!token) return;
        try {
            const res = await axios.get("https://tekzo.onrender.com/api/cart", {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true,
            });
            setCart(res.data);
            setCartCount(res.data.cartItems.length);
        } catch (err) {
            console.error("Error fetching cart:", err);
        }
    };

    useEffect(() => {
        fetchCart();
    }, [token]);

    return (
        <CartContext.Provider value={{ cart, setCart, cartCount, setCartCount, fetchCart }}>
            {children}
        </CartContext.Provider>
    );
};
export const useCart = () => {
    return useContext(CartContext); // always returns {cartCount, setCartCount}
};
