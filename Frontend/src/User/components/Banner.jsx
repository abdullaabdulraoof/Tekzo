import { height } from '@fortawesome/free-regular-svg-icons/faAddressBook'
import React from 'react'

export const Banner = () => {
    return (
        <section class="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#0A0C10] via-[#1A1D24] to-[#111318] text-white">

            <div class="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,hsl(217,91%,60%)_0%,transparent_70%)] opacity-20"></div>
            <div class="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(270,95%,75%)_0%,transparent_70%)] opacity-10"></div>
            <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="container m-auto grid lg:grid-cols-2 gap-12 items-center">
                    <div class="space-y-8 animate-fade-in">
                        <div className='flex justify-center items-center w-fit bg-[#0d0d0d] bg-opacity-[12%] outline outline-gray-800 outline-2 py-1 px-4 rounded-xl text-sm gap-3'>
                            <span className='text-gray-400'>New Collection</span>
                        </div>
                        <div className='flex flex-col gap-6 space-y-0'>
                            <h1 className='flex flex-col gap-2 text-6xl font-bold'>
                                <span>Premium</span>
                                <span className='text-[#5694F7]'>Audio</span>
                                <span>Experiance</span>
                            </h1>
                            <p className='text-lg text-gray-400'>
                                Discover our curated collection of premium wireless<br />
                                headphones, engineered for audiophiles who demand <br />
                                perfection.
                            </p>
                        </div>
                        <div className='buttons flex gap-4'>
                            <button className='flex justify-center items-center bg-[#5694F7] py-2 px-8 rounded-xl font-bold text-sm gap-2 transform transition-all duration-500 ease-in-out hover:shadow-[0_0_12px_#5694F7] hover:scale-x-105'>
                                <span>Shop Now</span>
                                <div className='flex justify-center items-center'>
                                <lord-icon
                                    src="https://cdn.lordicon.com/ircnfpus.json"
                                    trigger="hover"
                                    colors="primary:#ffffff"
                                        style={{ width: "20px" }}>
                                </lord-icon>

                                </div>
                                </button>
                            <button className='flex justify-center items-center bg-[#0d0d0d] bg-opacity-[12%] outline outline-gray-800 outline-2 py-2 px-8 rounded-xl font-bold text-sm gap-3
                            transform transition-all duration-500 ease-in-out hover:shadow-[0_0_12px_#5694F7] hover:scale-x-105'>
                            
                            <div className='flex justify-center items-center'>
                                <lord-icon
                                        src="https://cdn.lordicon.com/wjogzler.json"
                                        trigger="hover"
                                        colors="primary:#ffffff"
                                    style={{ width: "20px" }}>
                                </lord-icon>

                            </div>
                                <span>Watch Demo</span>
                            </button>
                        </div>

                        <div className='flex gap-7'>
                            <div className='flex flex-col'>
                                <span className='text-2xl font-bold'>50K+</span>
                                <span className='text-sm text-gray-400'>Happy Customers</span>
                            </div>
                            <div className='flex flex-col'>
                                <span className='text-2xl font-bold'>4.9</span>
                                <span className='text-sm text-gray-400'>Average Rating</span>
                            </div>
                            <div className='flex flex-col'>
                                <span className='text-2xl font-bold'>24/7</span>
                                <span className='text-sm text-gray-400'>Support</span>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-8 animate-fade-in">
                        <div
                            className="bg-cover bg-center h-[300px] w-[500px] rounded-xl relative animate-float"
                            style={{ backgroundImage: `url("/src/User/assets/headset.jpg")` }}
                        >
                            <div className='w-fit flex flex-col bg-[#181818] bg-opacity-[70%]  rounded-xl text-sm px-4  py-2 absolute top-4 left-4'>
                                <span className='text-sm font-bold'>Noice Cancelling</span>
                                <span className='text-xs text-gray-400'>Advanced ANC Technology</span>
                            </div>
                            <div className='w-fit flex flex-col bg-[#181818] bg-opacity-[70%]  rounded-xl text-sm px-4  py-2 absolute bottom-4 right-4'>
                                <span className='text-sm font-bold'>30H Battery</span>
                                <span className='text-xs text-gray-400'>All-day listening</span>
                            </div>


                        </div>
                        
                           
                        
                    </div>
                </div>

            </div>
        </section>

    )
}
