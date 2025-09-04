import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useParams } from 'react-router-dom'

import './Order.css';
import { Sidebar } from './Sidebar';

export const AccountDetails = () => {
    const token = localStorage.getItem("userToken")
    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const [defaultAddress, setDefaultAddress] = useState(null)
    const [username, setUsername] = useState('')


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
                
                setUser(res.data.user)
                const usernames = res.data.user
                setUsername(usernames.username)
                setDefaultAddress(res.data.defaultAddress)
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

                <div className='flex flex-col lg:flex-row gap-6 justify-between items-start w-full h-screen'>
                   



                    <div className='w-full lg:w-full bg-black border border-gray-700/70 rounded-xl shadow-2xl  h-[75%] p-4 flex flex-col gap-4'>
                        

                           <div className='flex flex-col gap-3 border border-gray-700/70 p-6 rounded-xl'>
                                
                                <h1 className='text-xl font-bold'>
                                    Personal Info
                                </h1>
                            {user ?
                                (<div className='flex flex-col gap-2 text-gray-400 text-sm'>
                                    <span>Fullname : {user.username}</span>
                                    <span>Email Address : {user.email}</span>
                                </div>
                                ) : (<p>Loading account details...</p>)}
                            </div>

                       


                        <div className='flex flex-col gap-3 border border-gray-700/70 p-6 rounded-xl'>

                            <h1 className='text-xl font-bold '>
                                Address & Delivery Details
                            </h1>
                            {defaultAddress ?
                                (<div className='flex flex-col gap-2 text-gray-400 text-sm'>
                                    <span>Address: {defaultAddress.address}</span>
                                    <span>pincode : {defaultAddress.pincode}</span>
                                    <span>country : {defaultAddress.country}</span>
                                   
                                </div>
                                ) : (<p>Loading account details...</p>)}
                        </div>

                        <div className='flex flex-col gap-3 border border-gray-700/70 p-6 rounded-xl'>

                            <h1 className='text-xl font-bold'>
                                Personal Info
                            </h1>
                            {user ?
                                (<div className='flex flex-col gap-2 text-gray-400 text-sm'>
                                    <label htmlFor="">Fullname:</label>
                                    <input type="text" id="name" value={username} className="rounded-xl px-2 py-2 text-sm bg-black border border-gray-400/20 outline-none" name="name" required
                                        placeholder="Enter Product Name" onChange={(e) => {
                                            setUsername(e.target.value)
                                        }}></input>
                                </div>
                                ) : (<p>Loading account details...</p>)}
                        </div>

                        

                    </div>
                </div>

            </div>
        </section>
    )
}
