import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export const OrderSuccess = () => {
    const token = localStorage.getItem("userToken")
    const navigate = useNavigate()

    useEffect(() => {
        if (!token) {
            console.error("No token found! Please login.");
            navigate("/login");
        }
    }, [token, navigate]);
    return (
        <section className='min-h-screen bg-black text-white'>
            <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-36 pt-24 pb-16'>

                <div className='pb-4 w-full text-center'>
                    <h2 className='text-2xl sm:text-3xl font-bold'>Order Placed</h2>
                    <p className='text-sm sm:text-base text-gray-400'>Your order is confirmed! Thanks for shopping with us</p>
                </div>
                <div className='flex justify-center w-full '>

                    <button className='flex justify-center items-center bg-[#5694F7] rounded-xl font-bold text-xs gap-2 transform transition-all duration-500 ease-in-out hover:shadow-[0_0_12px_#5694F7] hover:scale-x-105 py-2 px-3' type='submit' onClick={() => { navigate('/') }}>
                        <span>Continue Shopping</span>
                    </button>
                </div>



            </div>
        </section>
    )
}
