import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


export const ProductList = () => {
    const token = localStorage.getItem("userToken")
    console.log("Fetched userToken:", token);
    const navigate = useNavigate()

    if (!token) {
        console.error("No token found! Please login.");
        navigate("/login");
        return;
    }
    const [products, setProducts] = useState([]);

    useEffect(() => {

        async function fetchdata() {
            try {
                const res = await axios.get("http://localhost:3000/api/products", {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true,
                })
                setProducts(res.data.product)
            } catch (err) {
                console.error("Error fetching products:", err);
            }
        }
        fetchdata()
    }, [token])

    const handleProductDetail = (id) => {
        navigate(`/products/productDetails/${id}`)

    }
    const handleCart = async (id) => {
        try {
            const res = await axios.post("http://localhost:3000/api/products/cart", { productId: id }, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true,
            })
            console.log("Added to cart:", res.data.cart);
        } catch (err) {
            console.error("Error adding to cart:", err);
        }

    }


    return (
        <section className='min-h-screen bg-black text-white'>
            <div className='py-24 container m-auto items-center'>
                <div className='flex flex-col gap-4 text-center py-4'>
                    <h2 className='text-4xl font-bold'>Our Products</h2>
                    <p className='text-xl text-gray-400'>Discover our complete collection of premium products, carefully curated to meet your <br /> every need.</p>
                </div>

                <div className='flex flex-col md:flex-row md:gap-5 justify-center px-4 md:px-10 lg:px-28 container m-auto items-center py-2'>
                    <div className="flex items-center gap-2 border border-gray-400/40 rounded-xl px-4 py-2 w-[350px] max-w-md">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
                        </svg>
                        <input type="text" placeholder="Search" className="bg-transparent outline-none text-white w-full text-xs" />
                    </div>
                    <div className='flex gap-3 justify-between items-center'>
                        <div className='flex justify-center items-center w-fit bg-[#0d0d0d] bg-opacity-[12%] border border-gray-400/40 py-1 px-3 rounded-xl text-sm gap-3 hover:bg-blue-600'>
                            <span className='text-xs text-white font-bold'>All</span>
                        </div>

                        <div className='flex justify-center items-center w-fit bg-[#0d0d0d] bg-opacity-[12%] border border-gray-400/40 py-1 px-2 rounded-xl text-sm gap-3 hover:bg-blue-600'>
                            <span className='text-xs text-white font-bold'>Audio</span>
                        </div>

                        <div className='flex justify-center items-center w-fit bg-[#0d0d0d] bg-opacity-[12%] border border-gray-400/40 py-1 px-2 rounded-xl text-sm gap-3 hover:bg-blue-600'>
                            <span className='text-xs text-white font-bold'>Wearables</span>
                        </div>

                        <div className='flex justify-center items-center w-fit bg-[#0d0d0d] bg-opacity-[12%] border border-gray-400/40 py-1 px-2 rounded-xl text-sm gap-3 hover:bg-blue-600'>
                            <span className='text-xs text-white font-bold'>Computers</span>
                        </div>

                        <div className='flex justify-center items-center w-fit bg-[#0d0d0d] bg-opacity-[12%] border border-gray-400/40 py-1 px-2 rounded-xl text-sm gap-3 hover:bg-blue-600'>
                            <span className='text-xs text-white font-bold'>Accessories</span>
                        </div>
                    </div>
                    <div className='flex justify-center items-center border border-gray-400/40 rounded-lg px-2 py-2'>
                        <select name="" id="" className=' bg-black text-sm border-none outline-none'>
                            <option value="">Newest</option>
                            <option value="">Featured</option>
                            <option value="">Price: High to Low</option>
                            <option value="">Price: Low to High</option>
                            <option value="">Highest Rated</option>
                        </select>
                    </div>


                </div>


                <div className='flex flex-wrap gap-10 overflow-hidden h-fit justify-center items-center myContainer mx-auto px-4 md:px-10 lg:px-32 py-8 mt-8 '>

                    {products.map((pro) => (
                        <div key={pro._id} className='w-[320px] bg-black border border-gray-400/20 rounded-xl group overflow-hidden'>
                            <div className='relative h-[300px] overflow-hidden' onClick={() => {
                                handleProductDetail(pro._id)
                            }}>
                                <img src={`http://localhost:3000/${pro.images[0]}`} alt="Headset"
                                    className="w-full h-[300px] rounded-t-xl transition-transform duration-500 group-hover:scale-110" />
                                <div className='absolute flex justify-center items-center bg-[#181818] bg-opacity-[70%] rounded-full p-2 top-4 right-4 text-red-white cursor-pointer hover:scale-110 transition-transform h-fit'>
                                    <FontAwesomeIcon icon={faHeart} className='w-[14px]' />
                                </div>
                            </div>
                            <div className='flex flex-col gap-2 p-7 '>
                                <span className='text-sm'>{pro.brandName}</span>
                                <span className='text-lg font-bold' >{pro.name}</span>
                                <div className='flex items-end gap-3 '>
                                    <span className='text-xl font-bold'>₹{pro.offerPrice}</span>
                                    <span className='text-base text-gray-500 line-through'>M.R.P: ₹{pro.price}</span>

                                </div>


                                <button className='flex justify-center items-center bg-[#5694F7] w-full rounded-xl font-bold text-sm gap-2 opacity-0 group-hover:opacity-100 transform transition-all duration-500 ease-in-out hover:shadow-[0_0_12px_#5694F7] hover:scale-x-105' onClick={() => {
                                    handleCart(pro._id)
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
                            </div>
                        </div>
                    ))}



                </div>

            </div>
        </section>
    )
}
