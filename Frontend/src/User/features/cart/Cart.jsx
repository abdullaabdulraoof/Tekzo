import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../../../context/CartContext';
import { loadLordicon } from '../../../utils/loadLordicon';
import axios from "axios"

export const Cart = () => {
    const navigate = useNavigate()
    const token = localStorage.getItem("userToken")
    const [cart, setCart] = useState(null)
    const { cartCount, setCartCount } = useCart();
    

    useEffect(() => {
           if (!token) {
               console.error("No token found! Please login.");
               navigate("/login");
           }
       }, [token, navigate]);

    useEffect(() => {
        loadLordicon();
    }, []);

    useEffect(() => {
        const fetchdata = async () => {
            try {
                const res = await axios.get("https://tekzo.onrender.com/api/cart", { headers: { Authorization: `Bearer ${token}` }, withCredentials: true })
                setCart(res.data);
                setCartCount(res.data.cartItems.length);
               
            } catch (err) {
                console.error("Error displaying cart:", err);
            }

        }
        fetchdata()
    }, [token])

    const handleDeleteCart = async (id) => {
        try {
            const res = await axios.delete(`https://tekzo.onrender.com/api/cart/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true
            });
            setCart(res.data); // update cart in state
            setCartCount(prev => prev - 1);

        } catch (err) {
            console.error("Error deleting cart item:", err);
        }
    }

    const handleQuantity = async (productId, action) => {
        try {
            const res = await axios.put(`https://tekzo.onrender.com/api/cart/`, { productId, action }, { headers: { Authorization: `Bearer ${token}` }, withCredentials: true })
            setCart(res.data)
        } catch (err) {
            console.error("Error incrementing or decrementing the cart item:", err);

        }
    }
    const handleCheckout = (id)=>{
        navigate(`/checkout/${id}`)
    }

    return (
        <section className='min-h-screen bg-black text-white'>
            <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-36 pt-24 pb-16'>
                <div className='py-4 w-full'>
                    <h2 className='text-2xl sm:text-3xl font-bold'>Shopping Cart</h2>
                    <p className='text-sm sm:text-base text-gray-400'>{cart?.cartItems?.length || 0}  items in your cart</p>
                </div>

                <div className='flex flex-col lg:flex-row gap-6 justify-between items-start w-full'>
                    {cart?.cartItems?.map((item, i) => (
                    <div className='w-full lg:w-2/3 bg-black border border-gray-700/70 rounded-xl shadow-2xl overflow-y-scroll h-[50vh]'>

                        

                            <div key={i} className='flex flex-col sm:flex-row justify-between items-center gap-4 p-4 border-b border-gray-700/70'>

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


                    <div className='w-full lg:w-1/3 bg-black border border-gray-700/70 rounded-xl shadow-2xl h-auto lg:h-[40vh] p-4 flex flex-col gap-4'>
                        <div className='flex flex-col gap-6 border-1 border-b border-gray-700/70 pb-5'>
                            <span className='text-base font-bold'>Order Summary</span>
                            <div className='flex flex-col gap-4 text-xs'>
                                <div className='flex justify-between'>
                                    <span className='text-gray-400'>Subtotal</span>
                                    <span className='font-bold'>${cart?.totalCartPrice || 0}</span>
                                </div>
                                <div className='flex justify-between'>
                                    <span className='text-gray-400'>Shipping</span>
                                    <span className='font-bold'>Free</span>
                                </div>
                                <div className='flex justify-between'>
                                    <span className='text-gray-400'>Tax</span>
                                    <span className='font-bold'>$62.40</span>
                                </div>
                            </div>
                        </div>
                        <div className='flex justify-between'>
                            <span className='font-bold'>Total</span>
                            <span className='font-bold text-[#5694F7]'>${((cart?.totalCartPrice || 0) + 62.2).toFixed(2)}</span>
                        </div>
                        <div className=''>

                            <button className='flex justify-center items-center bg-[#5694F7] w-full rounded-xl font-bold text-xs gap-2 transform transition-all duration-500 ease-in-out hover:shadow-[0_0_12px_#5694F7] hover:scale-x-105 py-2' onClick={() => {
                                handleCheckout(cart._id)
                            }}>
                                <span>Proceed to Checkout</span>
                            </button>
                        </div>
                    </div>
                </div>


                <div className='flex justify-center lg:justify-start mt-8'>
                    <button className='bg-[#0d0d0d] bg-opacity-[12%] outline outline-gray-800 outline-2 py-2 px-4 rounded-xl font-bold text-sm transition-all duration-500 ease-in-out hover:shadow-[0_0_12px_#5694F7] hover:scale-105' onClick={() => {
                        navigate('/products')
                    }}>
                        <span>Continue Shopping</span>
                    </button>
                </div>
            </div>
        </section>
    );
};
