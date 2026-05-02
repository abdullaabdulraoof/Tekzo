import React, { useEffect } from 'react'
import { Address } from './Address'
import { useNavigate } from 'react-router-dom'
import { AccountDetails } from './AccountDetails'
import { Sidebar } from './Sidebar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';

export const Profilee = () => {
    const token = localStorage.getItem("userToken")
    const navigate = useNavigate()

    useEffect(() => {
        if (!token) {
            console.error("No token found! Please login.");
            navigate("/login");
        }
    }, [token, navigate]);

    return (
        <section className='min-h-screen bg-black text-white pt-28 pb-20'>
            <div className='container mx-auto px-4 md:px-10 lg:px-60'>
                <div className='mb-10'>
                    <h1 className='text-3xl sm:text-4xl font-bold tracking-tight'>Account</h1>
                    <p className='text-sm sm:text-base text-gray-400 mt-2'>Manage your account details and preferences</p>
                </div>
                <div className='flex flex-col lg:flex-row gap-10 items-start'>
                    {/* Sidebar */}
                    <Sidebar />

                    {/* Main Content */}
                    <div className='flex-1 space-y-6'>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-blue-600/10 flex items-center justify-center border border-blue-500/20">
                                <FontAwesomeIcon icon={faUserCircle} className="w-7 h-7 text-blue-400" />
                            </div>
                            <div>
                                <h2 className='text-3xl font-bold tracking-tight'>Profile Settings</h2>
                                <p className='text-gray-400 mt-1'>Manage your account details and addresses</p>
                            </div>
                        </div>

                        <div className='grid gap-6'>
                            <div className='bg-gray-900/20 border border-gray-800/50 rounded-2xl p-6 hover:border-gray-700/50 transition-colors'>
                                <AccountDetails />
                            </div>
                            
                            <div className='bg-gray-900/20 border border-gray-800/50 rounded-2xl p-6 hover:border-gray-700/50 transition-colors'>
                                <Address />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
