import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

export const Footer = () => {
    return (
        <footer>
            <div className='bg-black text-white border-t border-gray-600/30 w-full flex flex-col justify-between items-center mx-auto px-4 md:px-10 lg:px-60 lg:flex-row py-8 gap-5'>
                <div className='flex flex-col gap-4 w-full'>
                    <div className="logo font-bold text-lg text-[#5694F7]">
                        <h1 className=''>Tekzo</h1>
                    </div>
                    <div className='flex flex-col gap-1 text-xs text-gray-400'>
                        <span >Premium tech products designed for</span>
                        <span>the modern lifestyle. Experience</span>
                        <span>innovation at its finest.</span>
                    </div>

                    <div className='flex gap-3'>
                        <div className='w-fit p-1 bg-[#181818] bg-opacity-[70%] rounded-xl cursor-pointer hover:scale-110 transition-transform '>
                            <i className="fa-brands fa-facebook"></i>
                        </div>


                        <div className='w-fit p-1 bg-[#181818] bg-opacity-[70%] rounded-xl cursor-pointer hover:scale-110 transition-transform '>
                            <i className="fa-brands fa-instagram"></i>
                        </div>

                        <div className='w-fit p-1 bg-[#181818] bg-opacity-[70%] rounded-xl cursor-pointer hover:scale-110 transition-transform '>
                            <i className="fa-brands fa-x-twitter"></i>
                        </div>

                        <div className='w-fit p-1 bg-[#181818] bg-opacity-[70%] rounded-xl cursor-pointer hover:scale-110 transition-transform '>
                            <i className="fa-brands fa-youtube"></i>

                        </div>
                    </div>
                </div>

                <div className='w-full'>
                    <ul className='flex flex-col gap-3 text-xs'>
                        <li className='font-bold'>Products</li>
                        <li className='text-gray-400 hover:cursor-pointer hover:text-blue-500'>Headphones</li>
                        <li className='text-gray-400 hover:cursor-pointer hover:text-blue-500'>Smart Watches</li>
                        <li className='text-gray-400 hover:cursor-pointer hover:text-blue-500'>Laptops</li>
                        <li className='text-gray-400 hover:cursor-pointer hover:text-blue-500'>Accessories</li>
                    </ul>
                </div>
                <div className='w-full'>
                    <ul className='flex flex-col gap-3 text-xs'>
                        <li className='font-bold'>Support</li>
                        <li className='text-gray-400 hover:cursor-pointer hover:text-blue-500'>Contact Us</li>
                        <li className='text-gray-400 hover:cursor-pointer hover:text-blue-500'>FAQ</li>
                        <li className='text-gray-400 hover:cursor-pointer hover:text-blue-500'>Shipping</li>
                        <li className='text-gray-400 hover:cursor-pointer hover:text-blue-500'>Returns</li>
                    </ul>
                </div>




                <div className='flex flex-col gap-4 w-full'>
                    <span className='font-bold text-xs'>Stay Updated</span>
                    <div className='flex flex-col gap-1 text-xs text-gray-400'>
                        <span >Subscribe to get special offers, free</span>
                        <span>giveaways, and new product</span>
                        <span>announcements.</span>
                    </div>

                    <div className='flex gap-3'>
                        <input type="text" className='border border-gray-600 bg-transparent rounded-xl text-xs px-2' placeholder="Enter your mail" />
                        <div className='w-fit p-1 bg-[#181818] bg-opacity-[70%] rounded-xl cursor-pointer hover:scale-110 transition-transform '>
                            <FontAwesomeIcon icon={faEnvelope} className="text-gray-500" />

                        </div>
                    </div>
                </div>
            </div>
            <div className='bg-black text-white w-full justify-between items-center myContainer mx-auto px-4 md:px-10 lg:px-60 py-4'>
                <div className='bg-black text-white border-t border-gray-600 w-full flex flex-col justify-between items-center myContainer lg:flex-row mx-auto pt-4 '>
                    <div>
                        <span className='text-xs'>© 2024 Zenith. All rights reserved.</span>
                    </div>
                    <div className='flex gap-3 text-xs text-gray-500'>
                        <span>Privacy Policy</span>
                        <span>Terms of Service</span>
                        <span>Cookies</span>
                    </div>
                </div>
            </div>

        </footer>
    )
}
