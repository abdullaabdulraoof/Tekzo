import React, { useEffect } from 'react'
import { Address } from './Address'
import { useNavigate } from 'react-router-dom'

import { AccountDetails } from './AccountDetails'
import { Sidebar } from './Sidebar'


export const Profilee = () => {
    const token = localStorage.getItem("userToken")
    const navigate = useNavigate()

    useEffect(() => {
        if (!token) {
            console.error("No token found! Please login.");
            navigate("/login");
        }
    }, [token, navigate]);    return (
        <section className='min-h-screen bg-black text-white'>
            <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-36 pt-24 pb-16'>


                <div className='flex flex-col justify-between items-center gap-8 w-full '>
                    <div>

                        <h2 className='text-2xl sm:text-6xl font-bold'>Account</h2>
                    </div>
                    <Sidebar />
                </div>
                <div className='w-full h-screen mt-10'>
                    <div className='flex justify-center items-center bg-black border border-gray-700/70 rounded-xl shadow-2xl h-[75%] w-full'>
                    <Address />
                    <AccountDetails />
                    </div>
                </div>

            </div>
        </section>


    )
}
