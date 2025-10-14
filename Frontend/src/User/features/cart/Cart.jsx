import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CartItems from '../../components/Cart/CartItems';
import OrderSummery from '../../components/Cart/OrderSummery';
import axios from "axios"
 
export const Cart = () => {
    const navigate = useNavigate()
    const token = localStorage.getItem("userToken")
    const [cart, setCart] = useState(null)


    useEffect(() => {
        if (!token) {
            console.error("No token found! Please login.");
            navigate("/login");
        }
    }, [token, navigate]);



    useEffect(() => {
        const fetchdata = async () => {
            try {
                const res = await axios.get("https://tekzo.onrender.com/api/cart", { headers: { Authorization: `Bearer ${token}` }, withCredentials: true })
                setCart(res.data);

            } catch (err) {
                console.error("Error displaying cart:", err);
            }

        }
        fetchdata()
    }, [token])



    return (
        <section className='min-h-screen bg-black text-white'>
            <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-36 pt-24 pb-16'>
                <div className='py-4 w-full'>
                    <h2 className='text-2xl sm:text-3xl font-bold'>Shopping Cart</h2>
                    <p className='text-sm sm:text-base text-gray-400'>{cart?.cartItems?.length || 0}  items in your cart</p>
                </div>

                <div className='flex flex-col lg:flex-row gap-6 justify-between items-start w-full'>

                    <CartItems />
                    <OrderSummery />


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
