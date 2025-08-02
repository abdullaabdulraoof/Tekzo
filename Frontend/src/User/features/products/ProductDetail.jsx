import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
export const ProductDetail = () => {
    const navigate = useNavigate()
    return (
        <section className='min-h-screen bg-black text-white'>
            <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-36 pt-24 pb-16'>
                <div className='py-4 w-full'>
                    <button className='flex justify-center items-center bg-[#0d0d0d] bg-opacity-[12%] px-4 rounded-xl font-bold text-sm gap-2 transition-all duration-500 ease-in-out hover:bg-slate-400/20 py-2' onClick={() => {
                        navigate('/products')
                    }}>
                        <div className='flex justify-center items-center'>
                            <i class="fa-regular fa-circle-left"></i>
                        </div>
                        <span className='text-sm'>Back</span>
                    </button>
                </div>

                <div className='flex flex-col lg:flex-row gap-6 justify-between items-start w-full'>

                    <div className='w-full lg:w-1/2 bg-black rounded-xl shadow-2xl flex flex-col gap-6'>
                        <div className='flex flex-col justify-between items-start gap-4 border border-gray-700/70 rounded-xl h-[50vh] overflow-hidden'>
                            <img src="/src/assets/apple(1).jpg" alt="" className='w-full h-full bg-cover' />
                        </div>
                        <div className='flex justify-start items-center gap-4 rounded-xl'>
                            <div className='w-[50px] h-[40px] border border-gray-700/70 rounded-lg overflow-hidden'>
                                <img src="/src/assets/apple(1).jpg" alt="" className='w-full h-full bg-cover' />
                            </div>
                            <div className='w-[50px] h-[40px] border border-gray-700/70 rounded-lg overflow-hidden'>
                                <img src="/src/assets/apple(2).jpg" alt="" className='w-full h-full bg-cover' />
                            </div>
                            <div className='w-[50px] h-[40px] border border-gray-700/70 rounded-lg overflow-hidden'>
                                <img src="/src/assets/apple(3).jpg" alt="" className='w-full h-full bg-cover' />
                            </div>
                        </div>
                    </div>


                    <div className='w-full lg:w-1/2 bg-blac rounded-xl shadow-2xl h-auto lg:h-[40vh] p-4 flex flex-col gap-4'>
                        <div className='flex flex-col gap-4 border-1 pb-5'>

                            <div className='flex flex-col gap-2'>
                                <div className='flex justify-center items-center w-fit bg-[#0e050e] bg-opacity-[50%] text-white font-bold outline outline-gray-800 outline-2 py-1 px-3 rounded-xl text-xs gap-3'>
                                    <span>Best Seller</span>
                                </div>
                                <span className='text-2xl font-bold'>Premium Wireless Headphones</span>
                            </div>


                            <div className='flex flex-col '>
                                <span className='font-bold text-xl'>$779.96</span>
                                <span className='text-xs text-green-500'>In stock (15 available)</span>
                            </div>

                            <div className='text-xs text-gray-400'>
                                <p >Experience crystal-clear audio with our premium wireless headphones. Featuring advanced noise cancellation technology and up to 30 hours of battery life.</p>
                            </div>
                            <div className='flex justify-start items-center gap-2'>
                                <span className='text-xs font-bold'>Quantity:</span>
                                <div className='flex justify-center items-center space-x-2'>
                                    <button className='p-1 bg-slate-400/20 rounded-full text-sm w-6 h-6 flex items-center justify-center'>-</button>
                                    <span className='text-sm'>1</span>
                                    <button className='p-1 bg-slate-400/20 rounded-full text-sm w-6 h-6 flex items-center justify-center'>+</button>
                                </div>
                            </div>
                        </div>
                        <div className='flex gap-2'>

                            <button className='flex justify-center items-center bg-[#5694F7] w-full rounded-xl font-bold text-xs gap-2 transform transition-all duration-500 ease-in-out hover:shadow-[0_0_12px_#5694F7] hover:scale-x-105 py-1' onClick={() => {
                                navigate('/checkout')
                            }}>
                                <div className='flex justify-center items-center'>
                                    <lord-icon
                                        src="https://cdn.lordicon.com/ggirntso.json"
                                        trigger="hover"
                                        stroke="bold"
                                        colors="primary:#ffffff,secondary:#ffffff"
                                        style={{ width: "20px" }}>
                                    </lord-icon>
                                </div>
                                <span className='text-xs'>Add to cart</span>
                            </button>
                            <div className='flex justify-center items-center bg-[#181818] bg-opacity-[70%] rounded-xl px-5 top-4 right-4 text-red-white cursor-pointer hover:scale-110 transition-transform '>
                                <FontAwesomeIcon icon={faHeart} className='w-[14px]' />
                            </div>

                        </div>
                        <div className='flex justify-between items-center gap-2 rounded-xl border border-gray-700/70 p-2 px-4'>
                            <div className='flex flex-col overflow-hidden'>
                                <div className='flex justify-center items-center'>
                                <lord-icon
                                    src="https://cdn.lordicon.com/byupthur.json"
                                    trigger="hover"
                                    stroke="bold"
                                    colors="primary:#5694F7,secondary:#5694F7"
                                    style={{ width: "20px" }}>
                                </lord-icon>

                                </div>
                                <span className='text-xs text-gray-400'>Free Shipping</span>
                            </div>


                            <div className='flex flex-col overflow-hidden'>
                                <div className='flex justify-center items-center'>
                                    <lord-icon
                                        src="https://cdn.lordicon.com/sjoccsdj.json"
                                        trigger="hover"
                                        stroke="bold"
                                        colors="primary:#5694F7,secondary:#5694F7"
                                        style={{ width: "20px" }}>
                                    </lord-icon>

                                </div>
                                <span className='text-xs text-gray-400'>2 Year Warranty</span>
                            </div>


                            <div className='flex flex-col overflow-hidden'>
                                <div className='flex justify-center items-center'>
                                    <lord-icon
                                        src="https://cdn.lordicon.com/jzzzcrxv.json"
                                        trigger="hover"
                                        stroke="bold"
                                        colors="primary:#5694F7,secondary:#5694F7"
                                        style={{ width: "20px" }}>
                                    </lord-icon>

                                </div>
                                <span className='text-xs text-gray-400'>30 Day Returns</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
