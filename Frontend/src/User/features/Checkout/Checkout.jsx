import React from 'react'
import { useNavigate } from 'react-router-dom'
export const Checkout = () => {
    const navigate = useNavigate()
    return (
        <section className='min-h-screen bg-black text-white'>
            <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-36 pt-24 pb-16'>
                <div className='py-4 w-full'>
                    <button className='flex justify-center items-center bg-[#0d0d0d] bg-opacity-[12%] px-4 rounded-xl font-bold text-sm gap-2 transition-all duration-500 ease-in-out hover:bg-slate-400/20 py-2' onClick={() => {
                        navigate('/cart')
                    }}>
                        <div className='flex justify-center items-center'>
                            <i class="fa-regular fa-circle-left"></i>
                        </div>
                        <span className='text-sm'>Back to Cart</span>
                    </button>
                </div>
                <div className='pb-4 w-full'>
                    <h2 className='text-2xl sm:text-3xl font-bold'>Checkout</h2>
                    <p className='text-sm sm:text-base text-gray-400'>Complete your purchase</p>
                </div>

                <div className='flex flex-col lg:flex-row gap-6 justify-between items-start w-full'>

                    <div className='w-full lg:w-2/3 bg-black rounded-xl shadow-2xl flex flex-col gap-6'>
                        <div className='flex flex-col justify-between items-start gap-4 p-5 border border-gray-700/70 rounded-xl'>
                            <span className='text-lg font-bold'>Contact Details</span>

                            <div class="flex flex-col w-full gap-4 text-white">
                                <div className='flex flex-col gap-2'>
                                    <label for="mobile" className='text-xs font-bold'>Mobile</label>
                                    <input type="text" id="mobile" className="rounded-xl px-2 py-2 text-sm bg-black border border-gray-400/20 outline-none" name="mobile" required
                                        placeholder="123456789"></input>
                                </div>

                                <div className='flex flex-col gap-2'>
                                    <label for="email" className='text-xs font-bold'>Email</label>
                                    <input type="email" id="email" className="rounded-xl px-2 py-2 text-sm bg-black border border-gray-400/20 outline-none" name="email" required
                                        placeholder="@mail.com"></input>
                                </div>
                            </div>
                        </div>
                        <div className='flex flex-col justify-between items-start gap-4 p-5 border border-gray-700/70 rounded-xl'>
                            <span className='text-lg font-bold'>Shipping Information</span>

                            <div class="flex flex-col w-full gap-4 text-white">
                                <div className='flex flex-col gap-2'>
                                    <label for="address" className='text-xs font-bold'>Address</label>
                                    <input type="text" id="address" className="rounded-xl px-2 py-2 text-sm bg-black border border-gray-400/20 outline-none" name="address" required
                                        placeholder="123 Main St"></input>
                                </div>
                                <div className='flex flex-col gap-2'>
                                    <label for="pincode" className='text-xs font-bold'>Pincode</label>
                                    <input type="text" id="pincode" className="rounded-xl px-2 py-2 text-sm bg-black border border-gray-400/20 outline-none" name="pincode" required
                                        placeholder="100001"></input>
                                </div>

                                <div className='flex flex-col gap-2'>
                                    <label for="country" className='text-xs font-bold'>County</label>
                                    <input type="text" id="country" className="rounded-xl px-2 py-2 text-sm bg-black border border-gray-400/20 outline-none" name="country" required
                                        placeholder="India"></input>
                                </div>
                            </div>
                        </div>

                        <div className='flex justify-between items-CENTER gap-4 p-5 border border-gray-700/70 rounded-xl'>
                            <span className='text-lg font-bold'>Payment Method</span>
                            <div className='flex gap-4'>
                                <label className='flex items-center gap-2 text-sm font-bold cursor-pointer'>
                                    <input
                                        type='radio'
                                        name='payment-method'
                                        value='cod'
                                        className='form-radio text-blue-600'
                                    />
                                    COD
                                </label>

                                <label className='flex items-center gap-2 text-sm font-bold cursor-pointer'>
                                    <input
                                        type='radio'
                                        name='payment-method'
                                        value='online'
                                        className='form-radio text-blue-600'
                                    />Online
                                </label>
                            </div>
                        </div>
                    </div>


                    <div className='w-full lg:w-1/3 bg-black border border-gray-700/70 rounded-xl shadow-2xl h-auto lg:h-[40vh] p-4 flex flex-col gap-4'>
                        <div className='flex flex-col gap-6 border-1 border-b border-gray-700/70 pb-5'>
                            <span className='text-base font-bold'>Order Summary</span>
                            <div className='flex flex-col gap-4 text-xs'>
                                <div className='flex justify-between'>
                                    <span className='text-gray-400'>Subtotal</span>
                                    <span className='font-bold'>$779.96</span>
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
                            <span className='font-bold text-[#5694F7]'>$842.36</span>
                        </div>
                        <div className=''>

                            <button className='flex justify-center items-center bg-[#5694F7] w-full rounded-xl font-bold text-xs gap-2 transform transition-all duration-500 ease-in-out hover:shadow-[0_0_12px_#5694F7] hover:scale-x-105 py-2' onClick={() => {
                                navigate('/checkout')
                            }}>
                                <span>Place Order</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
