// context/CartContext.js
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios"; 


import { API_URL } from "../src/config/apiConfig";
import { useSocket } from "./SocketContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {

    const token = localStorage.getItem("userToken")
    const [cart, setCart] = useState(null)
    const [cartCount, setCartCount] = useState(0);

    const socket = useSocket();

    const fetchCart = async () => {
        if (!token) return;
        try {
            const res = await axios.get(`${API_URL}/api/cart`, {
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

    useEffect(() => {
        if (socket) {
            socket.on("cartUpdated", (data) => {
                // If the event specifies a userId, only refresh if it matches
                if (!data.userId || data.userId === localStorage.getItem("userId")) {
                    fetchCart();
                }
            });
            return () => socket.off("cartUpdated");
        }
    }, [socket, token]);

    return (
        <CartContext.Provider value={{ cart, setCart, cartCount, setCartCount, fetchCart }}>
            {children}
        </CartContext.Provider>
    );
};
export const useCart = () => {
    return useContext(CartContext); // always returns {cartCount, setCartCount}
};
