import React from 'react'
import { Sidebar } from './Sidebar'
export const Order = () => {
    return (
        <section className='min-h-screen bg-black text-white'>
            <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-36 pt-24 pb-16'>

                <div className='flex flex-col justify-between items-center pb-4 w-full lg:flex-row gap-2'>
                    <div>

                        <h2 className='text-2xl sm:text-3xl font-bold'>My Account</h2>
                    </div>
                    <Sidebar />
                </div>

                <div className='w-full h-screen'>




                    <div className='flex justify-center items-center bg-black border border-gray-700/70 rounded-xl shadow-2xl h-[75%] w-full'>


                        <div className='flex flex-col justify-start items-center border border-gray-700/70 p-6 rounded-xl w-[40%] h-[400px] gap-4'>

                            <h1 className='text-xl font-bold '>
                                Default Address
                            </h1>
                            (<p className='text-gray-400'>Loading account details...</p>)
                        </div>


                    </div>
                </div>

            </div>
        </section>
    )
}

