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
                const res = await axios.get(
                    "https://tekzo.onrender.com/api/account",
                    { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
                );



                if (res.data.defaultAddress) {
                    setDefaultAddress(res.data.defaultAddress);
                    setAddress(res.data.defaultAddress.address || "");
                    setPincode(res.data.defaultAddress.pincode || "");
                    setCountry(res.data.defaultAddress.country || "");
                } else {
                    setDefaultAddress(null);
                }
            } catch (err) {
                console.error("Error fetching account:", err);
            }
        };
        fetchAccount();
    }, [token]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.put(
                "https://tekzo.onrender.com/api/account/address",
                { address, pincode, country }, // ✅ body
                { headers: { Authorization: `Bearer ${token}` } } // ✅ config
            );

            setDefaultAddress(res.data.defaultAddress);
        } catch (err) {
            console.error("Error updating address:", err);
        }
    };
    return (




        <div className='flex flex-col justify-start items-center border border-gray-700/70 p-6 rounded-xl w-full h-[400px] gap-4'>

            <h1 className='text-xl font-bold '>
                Default Address
            </h1>
            {defaultAddress ?
                (
                    <div className='flex flex-col gap-4 w-full justify-between'>
                        <div className='flex gap-3 text-gray-400 text-sm pt-2 '>
                            <div className='flex justify-center items-center gap-2 w-1/2'>

                                <label>Address: </label>
                                <input className="rounded-xl px-2 py-2 text-sm bg-black border border-gray-400/20 outline-none w-full" type="text" value={address} onChange={(e) => {
                                    setAddress(e.target.value)
                                }} />
                            </div>
                            <div className='flex justify-center items-center gap-2 w-1/2'>

                                <label>Pincode : </label>
                                <input className="rounded-xl px-2 py-2 text-sm bg-black border border-gray-400/20 outline-none  w-full" type="text" value={pincode} onChange={(e) => {
                                    setPincode(e.target.value)
                                }} />
                            </div>

                            <div className='flex justify-start items-center gap-2 w-full'>

                                <label>country : </label>
                                <input className="rounded-xl px-2 py-2 text-sm bg-black border border-gray-400/20 outline-none w-full" type="text" value={country} onChange={(e) => {
                                    setCountry(e.target.value)
                                }} />
                            </div>
                        </div>
                        <div className='flex justify-center items-center'>

                            <button
                                className='flex justify-center items-center w-full bg-[#5694F7] py-2 px-3 rounded-xl text-xs gap-3 cursor-pointer text-white transform transition-all duration-500 ease-in-out hover:shadow-[0_0_12px_#5694F7] hover:scale-x-105' onClick={handleSubmit}

                            >
                                <span className='font-bold'>Save Changes</span>
                            </button>
                        </div>


                    </div>

                ) : (<p className='text-gray-400'>Loading account details...</p>)}
        </div>



    )
}

