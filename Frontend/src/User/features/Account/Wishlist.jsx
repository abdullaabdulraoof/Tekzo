import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './Order.css';
import { Sidebar } from './Sidebar';
import { loadLordicon } from '../../../utils/loadLordicon';
export const Wishlist = () => {
    const token = localStorage.getItem("userToken")
    const [wishlist, setWishlist] = useState([])


    const navigate = useNavigate()

    useEffect(() => {
        if (!token) {
            console.error("No token found! Please login.");
            navigate("/login");
        }
    }, [token, navigate]);

    useEffect(() => {
        loadLordicon();
    }, []);


    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                const res = await axios.get('https://tekzo.onrender.com/api/wishlist', { headers: { Authorization: `Bearer ${token}` }, withCredentials: true });
                
                setWishlist(res.data.wishlist.products || []);
            } catch (err) {
                console.error('Error fetching Wishlist:', err);
            }
        };
        fetchWishlist();
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
                    



                    <div className='w-full lg:w-full bg-black border border-gray-700/70 rounded-xl shadow-2xl   h-[75%] p-4 flex flex-col gap-4'>
                        <div className="flex flex-wrap justify-center lg:justify-start  gap-5 w-full px-9 h-500px py-3 overflow-x-auto">
                            {wishlist.length > 0 ? (
                                wishlist.map((w) => (
                                    <div key={w.product._id} className='py-4'>
                                        <div
                                            className="relative rounded-xl bg-cover bg-center transform translate-all duration-500 ease-in-out hover:shadow-[0_0_12px_#5694F7] hover:scale-x-105 h-[200px] w-[165px] "
                                            style={{
                                                backgroundImage: `url("${w.product.images[0]}")`
                                            }}





                                        >
                                            <div className='absolute bg-gray-900/60 bottom-0 w-full h-[35px] text-center flex items-center justify-center font-bold rounded-b-xl text-xs'>
                                                {w.product.name}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-400">Your wishlist is empty.</p>
                            )}












                        </div>

                    </div>
                </div>

            </div>
        </section>
    )
}
