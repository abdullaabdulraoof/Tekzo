import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios"
import { useCart } from '../../../../context/CartContext';


const OrderSummery = () => {
    const navigate = useNavigate()
    const token = localStorage.getItem("userToken")
    const { cart, setCart, setCartCount, fetchCart } = useCart();


    useEffect(() => {
        if (!token) {
            console.error("No token found! Please login.");
            navigate("/login");
        }
    }, [token, navigate]);


  

    const handleCheckout = (id) => {
        navigate(`/checkout/${id}`)
    }


  return (
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
  )
}

export default OrderSummery
