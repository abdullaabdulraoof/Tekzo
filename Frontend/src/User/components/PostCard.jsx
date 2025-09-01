import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export const PostCard = () => {
    const navigate = useNavigate()
    const token = localStorage.getItem("userToken")
    const [products, setProducts] = useState([])
    useEffect(() => {
        if (!token) {
                console.error("No token found! Please login.");
                navigate("/login");
        }
    }, [token, navigate])
    useEffect(() => {
        const fetchdata = async () => {
            const res = await axios.get("http://localhost:3000/api/getproductcard", { headers: { Authorization: `Bearer ${token}` }, withCredentials: true })
            console.log("Product JSON:", res.data);
            setProducts(res.data)
        }
        fetchdata()
    }, [])
    return (
        <section className=' bg-black text-white'>
            <div className='py-10 container m-auto items-center '>
                <div className='flex flex-col gap-4 px-4 md:px-10 lg:px-60'>
                    <h2 className='text-2xl font-bold'>Trending Deals 🔥</h2>
                </div>

                <div className='flex flex-wrap gap-10 overflow-hidden  h-fit justify-center items-center myContainer mx-auto px-5 md:px-10 lg:px-60 py-2 '>

                    <div className="flex justify-start gap-2 w-full px-2 overflow-x-scroll h-500px py-3">
                        { products.map((pro,index)=>
                        (<div key={index} onClick={()=>{
                            navigate(`/products/productDetails/${pro._id}`)
                        }}>

                            <div className="relative rounded-xl bg-cover bg-center  transform translate-all duration-500 ease-in-out hover:shadow-[0_0_12px_#5694F7] hover:scale-x-105 h-[200px] w-[165px]" style={{
                                backgroundImage: `url("http://localhost:3000/${pro.images[0].replace(/\\/g, "/")}")`
                            }}>

                                <div className='absolute bg-gray-900/60 bottom-0 w-full h-[35px] text-center py-3 font-bold rounded-b-xl text-xs'>{pro.name}</div>
                            </div>
                        </div>

                            ))
                        }

                        




                    </div>

                </div>
            </div>

            <div className='py-10 container m-auto items-center '>
                <div className='flex flex-col gap-4 px-4 md:px-10 lg:px-60'>
                    <h2 className='text-2xl font-bold'>Best Sellers</h2>
                </div>

                <div className='flex flex-wrap gap-10 overflow-hidden  h-fit justify-center items-center myContainer mx-auto px-5 md:px-10 lg:px-60 py-2 '>

                    <div className="flex justify-start gap-2 w-full px-2 overflow-x-scroll h-500px py-3">

                        {products.map((pro, index) =>
                        (<div key={index} onClick={() => {
                            navigate(`/products/productDetails/${pro._id}`)
                        }}>

                            <div className="relative rounded-xl bg-cover bg-center  transform translate-all duration-500 ease-in-out hover:shadow-[0_0_12px_#5694F7] hover:scale-x-105 h-[200px] w-[165px]" style={{
                                backgroundImage: `url("http://localhost:3000/${pro.images[0].replace(/\\/g, "/")}")`
                            }}>

                                <div className='absolute bg-gray-900/60 bottom-0 w-full h-[35px] text-center py-3 font-bold rounded-b-xl text-xs'>{pro.name}</div>
                            </div>
                        </div>

                        ))
                        }


                    </div>

                </div>
            </div>
        </section>
    )
}
