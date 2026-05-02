import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../../../context/CartContext';
import { loadLordicon } from '../../../utils/loadLordicon';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios"
import { API_URL } from '../../../config/apiConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';

const CartItems = () => {

    const navigate = useNavigate()
    const token = localStorage.getItem("userToken")
    const { cart, setCart, setCartCount, fetchCart } = useCart();



    useEffect(() => {
        if (!token) {
            console.error("No token found! Please login.");
            navigate("/login");
        }
        loadLordicon();
        fetchCart()
    }, [token, navigate]);

    const handleQuantity = async (productId, action) => {
        const updatedCart = { ...cart };
        const item = updatedCart.cartItems.find(i => i._id === productId);
        if (!item) return;

        if (action === 'increment') item.quantity += 1;
        else if (action === 'decrement' && item.quantity > 1) item.quantity -= 1;

        item.totalPrice = item.offerPrice * item.quantity;
        updatedCart.totalCartPrice = updatedCart.cartItems.reduce((acc, i) => acc + i.totalPrice, 0);

        setCart(updatedCart);

        try {
            await axios.put(
                `${API_URL}/api/cart/`,
                { productId, action },
                { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
            );
            await fetchCart();

        } catch (err) {
            console.error(err);
        }
    };


    const handleDeleteCart = async (productId) => {
        const prevCart = { ...cart };

        const updatedCart = {
            ...cart,
            cartItems: cart.cartItems.filter(item => item._id !== productId),
        };
        updatedCart.totalCartPrice = updatedCart.cartItems.reduce((acc, i) => acc + i.totalPrice, 0);

        setCart(updatedCart);
        setCartCount(updatedCart.cartItems.length);

        toast.info('Removing item...');

        try {
            const res = await axios.delete(`${API_URL}/api/cart/${productId}`, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true
            });

            if (res.status === 200 || res.status === 204) {
                await fetchCart();
                toast.success('Item removed from cart!');
            }
        } catch (err) {
            console.error(err);
            setCart(prevCart);
            setCartCount(prevCart.cartItems.length);
            toast.error('Failed to remove item!');
        }
    };





    return (
        <div className='flex flex-col gap-4 w-full lg:w-2/3 bg-black border border-gray-700/70 rounded-xl shadow-2xl overflow-y-scroll h-[50vh] scroll-smooth'>

            {cart?.cartItems?.map((item, i) => (
                <div key={i} className='group p-4 border-b border-gray-800/50 hover:bg-gray-900/20 transition-all duration-300'>
                    <div className='flex flex-col sm:flex-row items-center gap-6'>
                        {/* Image Container */}
                        <div className="w-24 h-24 flex-shrink-0 bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 group-hover:border-blue-500/30 transition-colors">
                            <img 
                                loading="lazy" 
                                src={item.images[0]} 
                                alt={item.name} 
                                className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500' 
                            />
                        </div>

                        {/* Product Info */}
                        <div className='flex-1 flex flex-col text-center sm:text-left'>
                            <span className='text-base font-bold text-gray-100'>{item.name}</span>
                            <span className='text-xs text-gray-500 uppercase tracking-wider mt-0.5'>{item.category}</span>
                            <span className='text-sm font-bold text-blue-400 mt-2'>₹{item.offerPrice.toLocaleString()}</span>
                        </div>

                        {/* Quantity Controls */}
                        <div className='flex items-center gap-4 bg-gray-900/50 p-2 rounded-xl border border-gray-800'>
                            <button 
                                className='w-8 h-8 flex items-center justify-center bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-300 transition-colors' 
                                onClick={() => handleQuantity(item._id || item.product, "decrement")}
                            >
                                -
                            </button>
                            <span className='text-sm font-bold w-4 text-center'>{item.quantity}</span>
                            <button 
                                className='w-8 h-8 flex items-center justify-center bg-blue-600 hover:bg-blue-500 rounded-lg text-white transition-colors' 
                                onClick={() => handleQuantity(item._id || item.product, "increment")}
                            >
                                +
                            </button>
                        </div>

                        {/* Price and Remove */}
                        <div className='flex flex-col items-center sm:items-end gap-3 min-w-[100px]'>
                            <div className='text-lg font-bold text-gray-100'>₹{item.totalPrice.toLocaleString()}</div>
                            <button 
                                className='flex items-center gap-2 px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 rounded-lg transition-all duration-300 group/remove' 
                                onClick={() => handleDeleteCart(item._id)}
                            >
                                <FontAwesomeIcon icon={faTrashAlt} className="w-3 h-3 text-rose-500 group-hover/remove:scale-110 transition-transform" />
                                <span className='text-rose-500 text-xs font-bold uppercase tracking-tighter'>Remove</span>
                            </button>
                        </div>
                    </div>
                </div>
            ))}


        </div>
    )
}

export default CartItems