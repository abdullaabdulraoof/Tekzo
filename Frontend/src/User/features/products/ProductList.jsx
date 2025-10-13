import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../../../context/CartContext';
import axios from 'axios';



export const ProductList = () => {
    const token = localStorage.getItem("userToken");
    const navigate = useNavigate()
    const [search, setSearch] = useState("");
    const [wishlist, setWishlist] = useState([]);
    const { cartCount, setCartCount } = useCart();

    const [products, setProducts] = useState([]);
    const [filterCategory, setFilterCategory] = useState("All");
    const [sortOption, setSortOption] = useState("newest");

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 6;

    // 🔐 Check login
    useEffect(() => {
        if (!token) {
            console.error("No token found! Please login.");
            navigate("/login");
        }
    }, [token, navigate]);



    // 📦 Fetch products from backend
    useEffect(() => {
        async function fetchdata() {
            try {
                const res = await axios.get("https://tekzo.onrender.com/api/products", {
                    headers: { Authorization: `Bearer ${token}` },
                    params: {
                        search,
                        category: filterCategory,
                        sort: sortOption,
                        page: currentPage,
                        limit: itemsPerPage
                    }
                });

                setProducts(res.data.products);
                setTotalPages(res.data.pages);
            } catch (err) {
                console.error("Error fetching products:", err);
            }
        }
        fetchdata();
    }, [token, search, filterCategory, sortOption, currentPage]);

    const handleProductDetail = (id) => {
        navigate(`/products/productDetails/${id}`)
    }

    const handleCart = async (id) => {
        try {
            await axios.post("https://tekzo.onrender.com/api/cart", { productId: id }, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true,
            })
            setCartCount(prev => prev + 1);
        } catch (err) {
            console.error("Error adding to cart:", err);
        }
    }

    // ❤️ Wishlist fetch
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

    const handleWishlist = async (id) => {
        try {
            const res = await axios.post("https://tekzo.onrender.com/api/wishlist", { prodtId: id }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const wishlistIds = res.data.wishlist.products.map(w =>
                typeof w.product === "string" ? w.product : w.product._id
            );
            setWishlist(wishlistIds);
        } catch (err) {
            console.error("Error adding to wishlist:", err);
        }
    };

    return (
        <section className='min-h-screen bg-black text-white'>
            <div className='py-24 container m-auto items-center'>
                {/* 🔍 Search + Filter + Sort */}
                <div className='flex flex-col md:flex-row gap-5 justify-center px-5 md:px-10 lg:px-60 container m-auto items-center py-2'>
                    {/* Search */}
                    <div className="flex items-center gap-2 border border-gray-400/40 rounded-xl px-4 py-2 w-[350px] max-w-md">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search"
                            value={search}
                            className="bg-transparent outline-none text-white w-full text-xs"
                            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                        />
                    </div>

                    {/* Category Filter */}
                    <div className='flex flex-col gap-3 justify-between items-center lg:flex-row'>
                        {["All", "Audio", "Wearables", "Laptop", "Accessories", "PC", "Mobiles"].map(cat => (
                            <div
                                key={cat}
                                onClick={() => { setFilterCategory(cat); setCurrentPage(1) }}
                                className={`cursor-pointer flex justify-center items-center w-fit 
      ${filterCategory === cat ? "bg-blue-600" : "bg-[#0d0d0d]"} 
      bg-opacity-[12%] border border-gray-400/40 py-1 px-3 rounded-xl text-sm gap-3`}
                            >
                                <span className='text-xs text-white font-bold'>{cat}</span>
                            </div>
                        ))}
                    </div>

                    {/* Sort */}
                    <div className='flex justify-center items-center border border-gray-400/40 rounded-lg px-2 py-2'>
                        <select
                            onChange={(e) => { setSortOption(e.target.value); setCurrentPage(1) }}
                            className=' bg-black text-sm border-none outline-none'
                        >
                            <option value="newest">Newest</option>
                            <option value="highToLow">Price: High to Low</option>
                            <option value="lowToHigh">Price: Low to High</option>
                        </select>
                    </div>
                </div>

                {/* 🛒 Product List */}
                <div className='flex flex-wrap gap-10 justify-center lg:justify-start items-center mx-auto px-5 md:px-10 lg:px-60 py-8 mt-8'>
                    {products.length > 0 ? (
                        products.map((pro) => (
                            <div key={pro._id} className='w-[320px] bg-black border border-gray-400/20 rounded-xl group overflow-hidden'>
                                <div className='relative h-[300px] overflow-hidden'>
                                    <img src={pro.images[0]} alt={pro.name}
                                        loading="lazy"
                                        className="w-full h-[300px] rounded-t-xl transition-transform duration-500 group-hover:scale-110"
                                        onClick={() => handleProductDetail(pro._id)} />
                                    <div className='absolute flex justify-center items-center bg-[#181818] bg-opacity-[70%] rounded-full p-2 top-4 right-4 cursor-pointer hover:scale-110 transition-transform'
                                        onClick={() => handleWishlist(pro._id)}>
                                        <FontAwesomeIcon
                                            icon={faHeart}
                                            className='w-[14px]'
                                            style={{ color: wishlist.includes(pro._id) ? "red" : "white" }}
                                        />
                                    </div>
                                </div>
                                <div className='flex flex-col gap-2 p-7 '>
                                    <span className='text-sm'>{pro.brandName}</span>
                                    <span className='text-lg font-bold'>{pro.name}</span>
                                    <div className='flex items-end gap-3 '>
                                        <span className='text-xl font-bold'>₹{pro.offerPrice}</span>
                                        <span className='text-base text-gray-500 line-through'>M.R.P: ₹{pro.price}</span>
                                    </div>
                                    <button
                                        className='flex justify-center items-center bg-[#5694F7] w-full rounded-xl font-bold text-sm gap-2 opacity-0 group-hover:opacity-100 transform transition-all duration-500 ease-in-out hover:shadow-[0_0_12px_#5694F7] hover:scale-x-105 py-2'
                                        onClick={() => handleCart(pro._id)}
                                    >
                                        <span className='text-xs'>Add to cart</span>
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-400">No products found.</p>
                    )}
                </div>

                {/* 📄 Pagination */}
                {totalPages > 1 && (
                    <div className='flex justify-center gap-3 py-5'>
                        {Array.from({ length: totalPages }, (_, idx) => (
                            <button
                                key={idx + 1}
                                onClick={() => setCurrentPage(idx + 1)}
                                className={`px-3 py-1 rounded ${currentPage === idx + 1 ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-200"}`}
                            >
                                {idx + 1}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}
