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
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')


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
                setEmail(usernames.email)
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


                        <div className='flex flex-col border border-gray-700/70 p-6 rounded-xl w-[40%]'>

                            <h1 className='text-xl font-bold text-center'>
                                Personal Info
                            </h1>
                            {user ?
                                (
                                    <div className='flex flex-col gap-3'>
                                        <div className='flex flex-col gap-2 text-gray-400 text-sm pt-2'>
                                            <div className='flex flex-col gap-2'>

                                            <label>Fullname : </label>
                                                <input className="rounded-xl px-2 py-2 text-sm bg-black border border-gray-400/20 outline-none" type="text" value={username} onChange={(e)=>{
                                                setUsername(e.target.value)
                                            }}/>
                                            </div>
                                            <div className='flex flex-col gap-2'>

                                            <label>Email : </label>
                                                <input className="rounded-xl px-2 py-2 text-sm bg-black border border-gray-400/20 outline-none" type="text" value={email} onChange={(e) => {
                                                setEmail(e.target.value)
                                            }} />
                                            </div>
                                        </div>
                                        <div >

                                            <button
                                                className='flex justify-center items-center w-full bg-[#5694F7] outline outline-gray-800 outline-2 py-2 px-3 rounded-xl text-xs gap-3 cursor-pointer hover:bg-gray-200 text-white'
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
