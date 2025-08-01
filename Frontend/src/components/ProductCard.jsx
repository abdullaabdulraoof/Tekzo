import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';


export const ProductCard = () => {
    return (
        <section className='min-h-screen bg-black text-white'>
            <div className='py-24 container m-auto items-center'>
                <div className='flex flex-col gap-4 text-center'>
                    <h2 className='text-4xl font-bold'>Featured Products</h2>
                    <p className='text-xl text-gray-400'>Discover our carefully curated selection of premium products, designed to<br /> elevate your everyday experience.</p>
                </div>

                <div className='flex flex-wrap gap-10 overflow-hidden h-fit justify-center items-center myContainer mx-auto px-4 md:px-10 lg:px-26 py-8 mt-8 '>

                    <div className='w-[320px] bg-black border border-gray-400/20 rounded-xl group overflow-hidden'>
                        <div className='relative h-[300px] overflow-hidden'>
                            <img src="/src/assets/laptop.jpg" alt="Headset"
                                className="w-full h-[300px] rounded-t-xl transition-transform duration-500 group-hover:scale-110" />
                            <div className='absolute flex justify-center items-center bg-[#181818] bg-opacity-[70%] rounded-full p-2 top-4 right-4 text-red-white cursor-pointer hover:scale-110 transition-transform h-fit'>
                                <FontAwesomeIcon icon={faHeart} className='w-[14px]' />
                            </div>
                        </div>
                        <div className='flex flex-col gap-5 p-7 '>
                            <span className='text-sm font-bold'>MacBook Pro 16"</span>
                            <span className='text-xl font-bold'>$2399</span>
                            <button className='flex justify-center items-center bg-[#5694F7] w-full rounded-xl font-bold text-sm gap-2 opacity-0 group-hover:opacity-100 transform transition-all duration-500 ease-in-out hover:shadow-[0_0_12px_#5694F7] hover:scale-x-105'>
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
                        </div>
                    </div>
                    
                    <div className='w-[320px] bg-black border border-gray-400/20 rounded-xl group overflow-hidden'>
                        <div className='relative h-[300px] overflow-hidden'>
                            <img src="/src/assets/laptop.jpg" alt="Headset"
                                className="w-full h-[300px] rounded-t-xl transition-transform duration-500 group-hover:scale-110" />
                            <div className='absolute flex justify-center items-center bg-[#181818] bg-opacity-[70%] rounded-full p-2 top-4 right-4 text-red-white cursor-pointer hover:scale-110 transition-transform h-fit'>
                                <FontAwesomeIcon icon={faHeart} className='w-[14px]' />
                            </div>
                        </div>
                        <div className='flex flex-col gap-5 p-7 '>
                            <span className='text-sm font-bold'>MacBook Pro 16"</span>
                            <span className='text-xl font-bold'>$2399</span>
                            <button className='flex justify-center items-center bg-[#5694F7] w-full rounded-xl font-bold text-sm gap-2 opacity-0 group-hover:opacity-100 transform transition-all duration-500 ease-in-out hover:shadow-[0_0_12px_#5694F7] hover:scale-x-105'>
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
                        </div>
                    </div>

                    <div className='w-[320px] bg-black border border-gray-400/20 rounded-xl group overflow-hidden'>
                        <div className='relative h-[300px] overflow-hidden'>
                            <img src="/src/assets/laptop.jpg" alt="Headset"
                                className="w-full h-[300px] rounded-t-xl transition-transform duration-500 group-hover:scale-110" />
                            <div className='absolute flex justify-center items-center bg-[#181818] bg-opacity-[70%] rounded-full p-2 top-4 right-4 text-red-white cursor-pointer hover:scale-110 transition-transform h-fit'>
                                <FontAwesomeIcon icon={faHeart} className='w-[14px]' />
                            </div>
                        </div>
                        <div className='flex flex-col gap-5 p-7 '>
                            <span className='text-sm font-bold'>MacBook Pro 16"</span>
                            <span className='text-xl font-bold'>$2399</span>
                            <button className='flex justify-center items-center bg-[#5694F7] w-full rounded-xl font-bold text-sm gap-2 opacity-0 group-hover:opacity-100 transform transition-all duration-500 ease-in-out hover:shadow-[0_0_12px_#5694F7] hover:scale-x-105'>
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
                        </div>
                    </div>

                    <div className='w-[320px] bg-black border border-gray-400/20 rounded-xl group overflow-hidden'>
                        <div className='relative h-[300px] overflow-hidden'>
                            <img src="/src/assets/laptop.jpg" alt="Headset"
                                className="w-full h-[300px] rounded-t-xl transition-transform duration-500 group-hover:scale-110" />
                            <div className='absolute flex justify-center items-center bg-[#181818] bg-opacity-[70%] rounded-full p-2 top-4 right-4 text-red-white cursor-pointer hover:scale-110 transition-transform h-fit'>
                                <FontAwesomeIcon icon={faHeart} className='w-[14px]' />
                            </div>
                        </div>
                        <div className='flex flex-col gap-5 p-7 '>
                            <span className='text-sm font-bold'>MacBook Pro 16"</span>
                            <span className='text-xl font-bold'>$2399</span>
                            <button className='flex justify-center items-center bg-[#5694F7] w-full rounded-xl font-bold text-sm gap-2 opacity-0 group-hover:opacity-100 transform transition-all duration-500 ease-in-out hover:shadow-[0_0_12px_#5694F7] hover:scale-x-105'>
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
                        </div>
                    </div>

                    <div className='w-[320px] bg-black border border-gray-400/20 rounded-xl group overflow-hidden'>
                        <div className='relative h-[300px] overflow-hidden'>
                            <img src="/src/assets/laptop.jpg" alt="Headset"
                                className="w-full h-[300px] rounded-t-xl transition-transform duration-500 group-hover:scale-110" />
                            <div className='absolute flex justify-center items-center bg-[#181818] bg-opacity-[70%] rounded-full p-2 top-4 right-4 text-red-white cursor-pointer hover:scale-110 transition-transform h-fit'>
                                <FontAwesomeIcon icon={faHeart} className='w-[14px]' />
                            </div>
                        </div>
                        <div className='flex flex-col gap-5 p-7 '>
                            <span className='text-sm font-bold'>MacBook Pro 16"</span>
                            <span className='text-xl font-bold'>$2399</span>
                            <button className='flex justify-center items-center bg-[#5694F7] w-full rounded-xl font-bold text-sm gap-2 opacity-0 group-hover:opacity-100 transform transition-all duration-500 ease-in-out hover:shadow-[0_0_12px_#5694F7] hover:scale-x-105'>
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
                        </div>
                    </div>

                    <div className='w-[320px] bg-black border border-gray-400/20 rounded-xl group overflow-hidden'>
                        <div className='relative h-[300px] overflow-hidden'>
                            <img src="/src/assets/laptop.jpg" alt="Headset"
                                className="w-full h-[300px] rounded-t-xl transition-transform duration-500 group-hover:scale-110" />
                            <div className='absolute flex justify-center items-center bg-[#181818] bg-opacity-[70%] rounded-full p-2 top-4 right-4 text-red-white cursor-pointer hover:scale-110 transition-transform h-fit'>
                                <FontAwesomeIcon icon={faHeart} className='w-[14px]' />
                            </div>
                        </div>
                        <div className='flex flex-col gap-5 p-7 '>
                            <span className='text-sm font-bold'>MacBook Pro 16"</span>
                            <span className='text-xl font-bold'>$2399</span>
                            <button className='flex justify-center items-center bg-[#5694F7] w-full rounded-xl font-bold text-sm gap-2 opacity-0 group-hover:opacity-100 transform transition-all duration-500 ease-in-out hover:shadow-[0_0_12px_#5694F7] hover:scale-x-105'>
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
                        </div>
                    </div>

                    
                </div>
                <div className='flex justify-center items-center gap-4'>
                    <button className='flex justify-center items-center bg-[#5694F7] py-2 px-8 rounded-xl font-bold text-sm gap-2 transform transition-all duration-500 ease-in-out hover:shadow-[0_0_12px_#5694F7] hover:scale-x-105'>
                        <span>View All Products</span>
                        <div className='flex justify-center items-center'>
                            <lord-icon
                                src="https://cdn.lordicon.com/ircnfpus.json"
                                trigger="hover"
                                colors="primary:#ffffff"
                                style={{ width: "20px" }}>
                            </lord-icon>

                        </div>
                    </button>
                </div>
            </div>
        </section>
    )
}
