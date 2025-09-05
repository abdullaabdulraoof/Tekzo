import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useParams } from 'react-router-dom'

import './Order.css';
import { Sidebar } from './Sidebar';

export const Address = () => {
    const token = localStorage.getItem("userToken")
    const navigate = useNavigate()
    const [address, setAddress] = useState('')
    const [pincode, setPincode] = useState('')
    const [country, setCountry] = useState('')
    const [defaultAddress, setDefaultAddress] = useState(null)



    useEffect(() => {
        if (!token) {
            console.error("No token found! Please login.");
            navigate("/login");
        }
    }, [token, navigate]);

    useEffect(() => {
        const fetchAccount = async () => {
            try {

                const res = await axios.get('https://tekzo.onrender.com/api/account', { headers: { Authorization: `Bearer ${token}` }, withCredentials: true })
                console.log(res.data);
                setDefaultAddress(res.data.defaultAddress)
                const defaultAddresses = res.data.defaultAddress
                setAddress(defaultAddresses.address)
                setPincode(defaultAddresses.pincode)
                setCountry(defaultAddresses.country)
            } catch (err) {
                console.error('Error fetching account:', err);
            }
        }
        fetchAccount()
    }, [token])





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
                            {defaultAddress ?
                                (
                                      <div className='flex flex-col gap-4 w-full'>
                                        <div className='flex flex-col gap-3 text-gray-400 text-sm pt-2 '>
                                            <div className='flex flex-col gap-2'>

                                                <label>Address : </label>
                                                <input className="rounded-xl px-2 py-2 text-sm bg-black border border-gray-400/20 outline-none" type="text" value={address} onChange={(e)=>{
                                                setAddress(e.target.value)
                                            }}/>
                                            </div>
                                            <div className='flex flex-col gap-2'>

                                                <label>Pincode : </label>
                                                <input className="rounded-xl px-2 py-2 text-sm bg-black border border-gray-400/20 outline-none" type="text" value={pincode} onChange={(e) => {
                                                setPincode(e.target.value)
                                            }} />
                                            </div>

                                            <div className='flex flex-col gap-2'>

                                                <label>country : </label>
                                                <input className="rounded-xl px-2 py-2 text-sm bg-black border border-gray-400/20 outline-none" type="text" value={country} onChange={(e) => {
                                                    setCountry(e.target.value)
                                                }} />
                                            </div>
                                        </div>
                                        <div >

                                            <button
                                                className='flex justify-center items-center w-full bg-[#5694F7] py-2 px-3 rounded-xl text-xs gap-3 cursor-pointer text-white transform transition-all duration-500 ease-in-out hover:shadow-[0_0_12px_#5694F7] hover:scale-x-105'
                                                onClick={() => handleEdit(p._id)}
                                            >
                                                <span className='font-bold'>Save Changes</span>
                                            </button>
                                        </div>


                                    </div>

                                ) : (<p>Loading account details...</p>)}
                        </div>


                    </div>
                </div>

            </div>
        </section>
    )
}

