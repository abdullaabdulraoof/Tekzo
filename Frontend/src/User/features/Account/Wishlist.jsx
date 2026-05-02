import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useSocket } from '../../../../context/SocketContext';
import { API_URL } from '../../../config/apiConfig';
import { Sidebar } from './Sidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faShoppingBag, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

export const Wishlist = () => {
    const token = localStorage.getItem("userToken")
    const [wishlist, setWishlist] = useState([])
    const socket = useSocket()
    const navigate = useNavigate()

    useEffect(() => {
        if (!token) {
            console.error("No token found! Please login.");
            navigate("/login");
        }
    }, [token, navigate]);

    const fetchWishlist = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/wishlist`, { 
                headers: { Authorization: `Bearer ${token}` }, 
                withCredentials: true 
            });
            setWishlist(res.data.wishlist.products || []);
        } catch (err) {
            console.error('Error fetching Wishlist:', err);
        }
    };

    useEffect(() => {
        fetchWishlist();
    }, [token])

    useEffect(() => {
        if (socket) {
            const handleWishlistUpdate = (data) => {
                if (!data.userId || data.userId === localStorage.getItem("userId")) {
                    fetchWishlist();
                }
            };
            socket.on("wishlistUpdated", handleWishlistUpdate);
            return () => socket.off("wishlistUpdated", handleWishlistUpdate);
        }
    }, [socket, token]);

    return (
        <section className='min-h-screen bg-black text-white pt-28 pb-20'>
            <div className='container mx-auto px-4 md:px-10 lg:px-60'>
                <div className='mb-10'>
                    <h1 className='text-3xl sm:text-4xl font-bold tracking-tight'>Account</h1>
                    <p className='text-sm sm:text-base text-gray-400 mt-2'>{wishlist.length} items saved in your wishlist</p>
                </div>
                <div className='flex flex-col lg:flex-row gap-10 items-start'>
                    {/* Sidebar */}
                    <Sidebar />

                    {/* Main Content */}
                    <div className='flex-1 space-y-6'>
                        <div>
                            <h2 className='text-3xl font-bold tracking-tight'>My Wishlist</h2>
                            <p className='text-gray-400 mt-1'>Keep track of products you love</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {wishlist.length > 0 ? (
                                wishlist.map((w) => (
                                    <div 
                                        key={w.product._id} 
                                        className="group relative bg-gray-900/20 border border-gray-800/50 rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all duration-300"
                                    >
                                        <div 
                                            className="aspect-square bg-cover bg-center cursor-pointer overflow-hidden"
                                            style={{ backgroundImage: `url("${w.product.images[0]}")` }}
                                            onClick={() => navigate(`/products/productDetails/${w.product._id}`)}
                                        >
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                                <button 
                                                    className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white hover:bg-blue-500 transition-colors shadow-lg"
                                                    title="View Details"
                                                >
                                                    <FontAwesomeIcon icon={faShoppingBag} className="w-5 h-5" />
                                                </button>
                                                <button 
                                                    className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-rose-400 hover:bg-gray-700 transition-colors shadow-lg"
                                                    title="Remove from Wishlist"
                                                >
                                                    <FontAwesomeIcon icon={faTrashAlt} className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                        
                                        <div className="p-4 bg-gray-900/40 backdrop-blur-sm border-t border-gray-800/50">
                                            <h3 className="font-bold text-gray-100 line-clamp-1">{w.product.name}</h3>
                                            <div className="mt-2 flex items-center justify-between">
                                                <p className="text-lg font-bold text-blue-400">₹{w.product.price?.toLocaleString()}</p>
                                                <div className="flex items-center gap-1 text-xs text-gray-500 bg-gray-800/50 px-2 py-1 rounded-lg">
                                                    <FontAwesomeIcon icon={faHeart} className="w-3 h-3 text-rose-500" />
                                                    <span>Saved</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full flex flex-col items-center justify-center py-20 bg-gray-900/20 border border-gray-800/50 rounded-2xl text-center">
                                    <div className="w-16 h-16 rounded-2xl bg-gray-800/50 flex items-center justify-center mb-4">
                                        <FontAwesomeIcon icon={faHeart} className="w-8 h-8 text-gray-600" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-300">Wishlist is empty</h3>
                                    <p className="text-gray-500 mt-2 max-w-xs">Start saving items you like to see them here.</p>
                                    <button 
                                        onClick={() => navigate('/products')}
                                        className="mt-6 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-600/20"
                                    >
                                        Explore Products
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
