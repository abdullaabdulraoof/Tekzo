import React from 'react';
import { useCart } from '../../../../context/CartContext';
import axios from 'axios';
import { loadLordicon } from '../../../utils/loadLordicon';
import { useNavigate } from 'react-router-dom';
import debounce from 'lodash.debounce';

const CartItems = () => {
    const { cart, setCart, setCartCount, fetchCart } = useCart();
    const token = localStorage.getItem("userToken");
    const navigate = useNavigate();

    React.useEffect(() => {
        if (!token) {
            navigate("/login");
        }
        loadLordicon();
    }, [token, navigate]);

    // 🧠 Debounced Quantity Update
    const handleQuantity = React.useCallback(
        debounce(async (productId, action) => {
            try {
                const res = await axios.put(
                    `https://tekzo.onrender.com/api/cart/`,
                    { productId, action },
                    { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
                );
                setCart(res.data);
            } catch (err) {
                console.error("Error updating quantity:", err);
            }
        }, 400),
        []
    );

    const handleDeleteCart = async (id) => {
        try {
            const res = await axios.delete(`https://tekzo.onrender.com/api/cart/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true,
            });
            setCart(res.data);
            setCartCount(res.data.cartItems.length);
        } catch (err) {
            console.error("Error deleting cart item:", err);
        }
    };

    return (
        <div className="flex flex-col gap-4 w-full lg:w-2/3 bg-black border border-gray-700/70 rounded-xl shadow-2xl overflow-y-scroll scroll-smooth h-[50vh]">
            {cart?.cartItems?.length > 0 ? (
                cart.cartItems.map((item, i) => (
                    <div key={i} className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 border-b border-gray-700/70">
                        <div>
                            <img loading="lazy" src={item.images[0]} alt={item.name} className="w-[90px] h-[70px] rounded-xl" />
                        </div>
                        <div className="flex flex-col text-center sm:text-left">
                            <span className="text-sm font-bold">{item.name}</span>
                            <span className="text-xs">{item.category}</span>
                            <span className="text-sm font-bold">${item.offerPrice}</span>
                        </div>
                        <div className="flex justify-center items-center space-x-2">
                            <button onClick={() => handleQuantity(item._id, "decrement")} className="p-1 bg-slate-400/20 rounded-full text-sm w-6 h-6 flex items-center justify-center">-</button>
                            <span className="text-sm">{item.quantity}</span>
                            <button onClick={() => handleQuantity(item._id, "increment")} className="p-1 bg-slate-400/20 rounded-full text-sm w-6 h-6 flex items-center justify-center">+</button>
                        </div>
                        <div className="flex flex-col gap-1 items-center justify-center">
                            <div>${item.totalPrice}</div>
                            <button onClick={() => handleDeleteCart(item._id)} className="flex justify-center items-center bg-[#0d0d0d] bg-opacity-[12%] px-2 rounded-xl font-bold text-sm gap-2 transition-all duration-500 ease-in-out hover:bg-slate-400/20">
                                <lord-icon src="https://cdn.lordicon.com/oqeixref.json" trigger="hover" colors="primary:#FF0000" style={{ width: "14px" }}></lord-icon>
                                <span className="text-[#FF0000] text-xs">Remove</span>
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-center text-gray-400 py-10">Your cart is empty 🛒</p>
            )}
        </div>
    );
};

export default CartItems;
