import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../../context/CartContext";
import axios from "axios";

export const Navbar = () => {
    const [user, setUser] = useState(null); // user info or null
    const token = localStorage.getItem("userToken")
    const navigate = useNavigate();
    const { cartCount, setCartCount } = useCart();
    const isUser = !!token

    
    
    
    const handleLogout = async (e) => {
        e.preventDefault()
        const res = await axios.post("https://tekzo.onrender.com/api/logout", { withCredentials: true })
        localStorage.removeItem('userToken');
        navigate('/login')

    };

  

    useEffect(() => {
        if (!token) {
            setCartCount(0); // reset cart count after logout
            return;
        }
        try{
            const fetchCartcount = async()=>{
                const res = await axios.get('https://tekzo.onrender.com/api/cart/count', { headers: { Authorization: `Bearer ${token}` },withCredentials:true })
               
                setCartCount(res.data.count);
            }
            fetchCartcount()
        } catch (err) {
            console.error('Error fetching users:', err);
        }
    }, [token]);


    return (
        <header>
            <nav className="bg-black text-white fixed w-full top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg">
                <div className="flex h-16 justify-between items-center myContainer mx-auto px-4 md:px-10 lg:px-60 py-8">
                    {/* Logo */}
                    <div
                        className="logo font-bold text-2xl text-[#5694F7] hover:cursor-pointer"
                        onClick={() => navigate("/")}
                    >
                        <h1>Tekzo</h1>
                    </div>

                    {/* Icons */}
                    <div className="flex gap-4 justify-center items-center hover:cursor-pointer">
                        {/* Search Icon */}
                        <div className="flex gap-1 justify-center items-center text-gray-300 hover:text-white hover:shadow-[0_0_10px_#3B82F6]
 rounded-lg px-2"
                            onClick={() => navigate("/products")}>

                            <lord-icon
                                src="https://cdn.lordicon.com/zmvzumis.json"
                                trigger="hover"
                                stroke="bold"
                                colors="primary:#ffffff"
                                style={{ width: "20px" }}
                            ></lord-icon>
                        </div>




                        {/* Cart Icon */}
                        <div
                            className="relative flex gap-1 justify-center items-center text-gray-300 hover:text-white hover:shadow-[0_0_10px_#3B82F6]
 rounded-lg px-2"
                            onClick={() => navigate("/cart")}
                            title="Cart"
                        >

                            <lord-icon
                                src="https://cdn.lordicon.com/ggirntso.json"
                                trigger="hover"
                                stroke="bold"
                                colors="primary:#ffffff,secondary:#ffffff"
                                style={{ width: "20px" }}
                            ></lord-icon>
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full text-xs w-5 h-5 flex justify-center items-center font-bold pointer-events-none">
                                    {cartCount}
                                </span>
                            )}
                        </div>

                        {/* account Icon */}
                        {isUser && (
                            <div
                                className="flex gap-1 justify-center items-center text-gray-300 hover:text-white hover:shadow-[0_0_10px_#3B82F6]
 rounded-lg px-2"
                                onClick={() => navigate("/ordersList")}
                                title="Login"
                            >
                                <lord-icon
                                    src="https://cdn.lordicon.com/kdduutaw.json"
                                    trigger="hover"
                                    stroke="bold"
                                    colors="primary:#ffffff,secondary:#ffffff"
                                    style={{ width: "20px" }}
                                ></lord-icon>
                            </div>
                        )}


                        {/* Login / Logout Icon */}

                        {isUser && (
                            <div
                                className='flex gap-1 justify-center items-center bg-[#3B70D3] rounded-lg px-2'
                                onClick={handleLogout}
                                title="Logout"

                            >
                                <lord-icon
                                    src="https://cdn.lordicon.com/vfiwitrm.json"
                                    trigger="hover"
                                    stroke="bold"
                                    colors="primary:#ffffff,secondary:#ffffff"
                                    style={{ width: "20px" }}
                                ></lord-icon>
                                <span className="text-white font-medium">logout</span>
                            </div>
                        )}
                        {!isUser && (
                            <div
                                className="flex gap-1 justify-center items-center bg-[#5694F7] rounded-lg px-2"
                                onClick={() => navigate("/login")}
                                title="Login"
                            >
                                <lord-icon
                                    src="https://cdn.lordicon.com/kdduutaw.json"
                                    trigger="hover"
                                    stroke="bold"
                                    colors="primary:#ffffff,secondary:#ffffff"
                                    style={{ width: "20px" }}
                                ></lord-icon>
                                <span className="text-white font-medium">login</span>
                            </div>
                        )}

                       
                    </div>
                </div>
            </nav>
        </header>
    );
};
