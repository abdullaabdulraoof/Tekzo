import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useCart } from '../../../../context/CartContext';
import axios from 'axios'
import { loadLordicon } from "../utils/loadLordicon";



export const ProductDetail = () => {
    const token = localStorage.getItem("userToken")
    const navigate = useNavigate()
    const [product, setProduct] = useState(null);
    const { id } = useParams();
    const [picture, setPicture] = useState('')
    const { cartCount, setCartCount } = useCart();
    const [loading, setLoading] = useState(true);
    const [wishlist, setWishlist] = useState([]);

    // Redirect if no token
    useEffect(() => {
        if (!token) {
            console.error("No token found! Please login.");
            navigate("/login");
        }
    }, [token, navigate]);

    useEffect(() => {
        loadLordicon();
    }, []);

    // Fetch Product
    useEffect(() => {
        async function fetchData() {
            try {
                const res = await axios.get(
                    `https://tekzo.onrender.com/api/products/productDetails/${id}`,
                    { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
                );
                setProduct(res.data.product);
            } catch (err) {
                console.error("Error fetching product:", err);
            } finally {
                setLoading(false); // ✅ stop spinner
            }
        }
        fetchData();
    }, [token, id]);

    //Fetch Wishlist
    useEffect(() => {
        async function fetchWishlist() {
            try {
                const res = await axios.get("https://tekzo.onrender.com/api/wishlist", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const wishlistIds = res.data.wishlist.products.map(w =>
                    typeof w.product === "string" ? w.product : w.product._id
                );
                setWishlist(wishlistIds);
            } catch (err) {
                console.error("Error fetching wishlist:", err);
            }
        }
        fetchWishlist();
    }, [token]);

    const handleImage = (image) => setPicture(image);

    const handleCart = async (id) => {
        try {
            const res = await axios.post("https://tekzo.onrender.com/api/cart",
                { productId: id },
                { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
            );
            
            setCartCount(prev => prev + 1);
        } catch (err) {
            console.error("Error adding to cart:", err);
        }
    };

    const handleWishlist = async (id) => {
        try {
            const res = await axios.post("https://tekzo.onrender.com/api/wishlist",
                { prodtId: id }, 
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const wishlistIds = res.data.wishlist.products.map(w =>
                typeof w.product === "string" ? w.product : w.product._id
            );
            setWishlist(wishlistIds);
        } catch (err) {
            console.error("Error adding to wishlist:", err);
        }
    };

    //Show Spinner while loading
    if (loading) {
        return (
            <section className="min-h-screen flex justify-center items-center bg-black text-white">
                <div className="w-12 h-12 border-4 border-gray-600 border-t-[#5694F7] rounded-full animate-spin"></div>
            </section>
        )
    }

    if (!product) return <p className="text-white">Product not found</p>;
   
    return (
        <section className='min-h-screen bg-black text-white'>
            <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-36 pt-24 pb-16'>
                <div className='py-4 w-full'>
                    <button className='flex justify-center items-center bg-[#0d0d0d] bg-opacity-[12%] px-4 rounded-xl font-bold text-sm gap-2 transition-all duration-500 ease-in-out hover:bg-slate-400/20 py-2' onClick={() => {
                        navigate('/products')
                    }}>
                        <div className='flex justify-center items-center'>
                            <i className="fa-regular fa-circle-left"></i>
                        </div>
                        <span className='text-sm'>Back</span>
                    </button>
                </div>

                <div className='flex flex-col lg:flex-row gap-6 justify-between items-start w-full'>

                    <div className='w-full lg:w-1/2 bg-black rounded-xl shadow-2xl flex flex-col gap-6'>
                        <div className='flex flex-col justify-between items-start gap-4 border border-gray-700/70 rounded-xl h-[50vh] overflow-hidden' >
                            <img src={picture || product.images[0]} alt={product.name} className="w-full h-full object-cover" />

                        </div>
                        <div className='flex justify-start items-center gap-4 rounded-xl' >

                            {product.images.map((img, index) => (
                                <div key={index} className='w-[50px] h-[40px] border border-gray-700/70 rounded-lg overflow-hidden hover:cursor-pointer' onClick={() => handleImage(img)}>
                                    <img src={img} alt="" className='w-full h-full bg-cover' />

                                </div>
                            ))}


                        </div>
                    </div>


                    <div className='w-full lg:w-1/2 bg-blac rounded-xl shadow-2xl h-auto lg:h-[40vh] p-4 flex flex-col gap-4'>
                        <div className='flex flex-col gap-4 border-1 pb-5'>

                            <div className='flex flex-col gap-2'>
                                <div className='flex justify-center items-center w-fit bg-[#0e050e] bg-opacity-[50%] text-white font-bold outline outline-gray-800 outline-2 py-1 px-3 rounded-xl text-xs gap-3'>
                                    <span>{product.tag}</span>
                                </div>
                                <span className='text-2xl font-bold'>{product.name}</span>
                            </div>


                            <div className='flex flex-col '>
                                <div className='flex gap-3'>
                                    <span className='font-bold text-xl'>${product.offerPrice}</span>
                                    <span className='text-gray-400 font-bold text-lg line-through'>${product.price}</span>

                                </div>
                                <span className='text-xs text-green-500'>In stock ({product.stockQty} available)</span>
                            </div>

                            <div className='text-xs text-gray-400'>
                                <p>{product.desc}</p>
                            </div>

                        </div>
                        <div className='flex gap-2'>

                            <button className='flex justify-center items-center bg-[#5694F7] w-full rounded-xl font-bold text-xs gap-2 transform transition-all duration-500 ease-in-out hover:shadow-[0_0_12px_#5694F7] hover:scale-x-105 py-1' onClick={() => {
                                handleCart(product._id)
                            }}>
                                <div className='flex justify-center items-center'>
                                    <lord-icon
                                        src="https://cdn.lordicon.com/ggirntso.json"
                                        trigger="hover"
                                        stroke="bold"
                                        colors="primary:#ffffff,secondary:#ffffff"
                                        style={{ width: "20px" }}>
                                    </lord-icon>
                                </div>
                                <span className='text-xs'>Add to cart</span>
                            </button>
                            <div className='flex justify-center items-center bg-[#181818] bg-opacity-[70%] rounded-xl px-5 top-4 right-4 text-red-white cursor-pointer hover:scale-110 transition-transform ' onClick={() => handleWishlist(product._id)}>
                                <FontAwesomeIcon
                                    icon={faHeart}
                                    className='w-[14px]'
                                    style={{
                                        color: wishlist.includes(product._id) ? "red" : "white"
                                    }}
                                />
                            </div>

                        </div>
                        <div className='flex justify-between items-center gap-2 rounded-xl border border-gray-700/70 p-2 px-4'>
                            <div className='flex flex-col overflow-hidden'>
                                <div className='flex justify-center items-center'>
                                    <lord-icon
                                        src="https://cdn.lordicon.com/byupthur.json"
                                        trigger="hover"
                                        stroke="bold"
                                        colors="primary:#5694F7,secondary:#5694F7"
                                        style={{ width: "20px" }}>
                                    </lord-icon>

                                </div>
                                <span className='text-xs text-gray-400'>Free Shipping</span>
                            </div>


                            <div className='flex flex-col overflow-hidden'>
                                <div className='flex justify-center items-center'>
                                    <lord-icon
                                        src="https://cdn.lordicon.com/sjoccsdj.json"
                                        trigger="hover"
                                        stroke="bold"
                                        colors="primary:#5694F7,secondary:#5694F7"
                                        style={{ width: "20px" }}>
                                    </lord-icon>

                                </div>
                                <span className='text-xs text-gray-400'>2 Year Warranty</span>
                            </div>


                            <div className='flex flex-col overflow-hidden'>
                                <div className='flex justify-center items-center'>
                                    <lord-icon
                                        src="https://cdn.lordicon.com/jzzzcrxv.json"
                                        trigger="hover"
                                        stroke="bold"
                                        colors="primary:#5694F7,secondary:#5694F7"
                                        style={{ width: "20px" }}>
                                    </lord-icon>

                                </div>
                                <span className='text-xs text-gray-400'>30 Day Returns</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
