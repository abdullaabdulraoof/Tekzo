import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../../../context/CartContext';
import { loadLordicon } from '../../../utils/loadLordicon';
import axios from "axios"

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
    }, [token, navigate]);

    const handleQuantity = async (productId, action) => {
        // Optimistically update cart locally
        const updatedCart = { ...cart };
        const item = updatedCart.cartItems.find(i => i._id === productId);
        if (!item) return;

        if (action === 'increment') item.quantity += 1;
        else if (action === 'decrement' && item.quantity > 1) item.quantity -= 1;

        item.totalPrice = item.offerPrice * item.quantity;
        updatedCart.totalCartPrice = updatedCart.cartItems.reduce((acc, i) => acc + i.totalPrice, 0);

        setCart(updatedCart);

        // Call API in background
        try {
            await axios.put(
                `https://tekzo.onrender.com/api/cart/`,
                { productId, action },
                { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
            );
        } catch (err) {
            console.error(err);
        }
    };



    const handleDeleteCart = async (id) => {
        const updatedCart = {
            ...cart,
            cartItems: cart.cartItems.filter(item => item._id !== id)
        };
        updatedCart.totalCartPrice = updatedCart.cartItems.reduce((acc, i) => acc + i.totalPrice, 0);
        setCart(updatedCart);
        setCartCount(updatedCart.cartItems.length);
        toast.success('Item removed from cart!');


        try {
            await axios.delete(`https://tekzo.onrender.com/api/cart/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true
            });
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
                <div className=''>

                    <div key={i} className='flex flex-col sm:flex-row justify-between items-center gap-4 p-4 border-b border-gray-700/70 '>

                        <div>
                            <img loading="lazy" src={item.images[0]} alt="" className='w-[90px] h-[70px] rounded-xl' />
                        </div>


                        <div className='flex flex-col text-center sm:text-left'>
                            <span className='text-sm font-bold'>{item.name}</span>
                            <span className='text-xs'>{item.category}</span>
                            <span className='text-sm font-bold'>${item.offerPrice}</span>
                        </div>


                        <div className='flex justify-center items-center space-x-2'>
                            <button className='p-1 bg-slate-400/20 rounded-full text-sm w-6 h-6 flex items-center justify-center' onClick={() => {
                                handleQuantity(item._id, "decrement")
                            }}>-</button>
                            <span className='text-sm'>{item.quantity}</span>
                            <button className='p-1 bg-slate-400/20 rounded-full text-sm w-6 h-6 flex items-center justify-center' onClick={() => {
                                handleQuantity(item._id, "increment")
                            }}>+</button>
                        </div>


                        <div className='flex flex-col gap-1 items-center justify-center'>
                            <div>${item.totalPrice}</div>
                            <button className='flex justify-center items-center bg-[#0d0d0d] bg-opacity-[12%] px-2 rounded-xl font-bold text-sm gap-2 transition-all duration-500 ease-in-out hover:bg-slate-400/20' onClick={() => {
                                handleDeleteCart(item._id)
                            }}>
                                <div className='flex justify-center items-center'>
                                    <lord-icon
                                        src="https://cdn.lordicon.com/oqeixref.json"
                                        trigger="hover"
                                        colors="primary:#FF0000"
                                        style={{ width: "14px" }}>
                                    </lord-icon>
                                </div>
                                <span className='text-[#FF0000] text-xs'>Remove</span>
                            </button>
                        </div>
                    </div>
                </div>

            ))}


        </div>
    )
}

export default CartItems