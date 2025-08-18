import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const Navbar = () => {
    const [user, setUser] = useState(null); // user info or null
    const navigate = useNavigate();

    const token = localStorage.getItem("token")
    const isUser = !!token
    const handleLogout = async (e) => {
        e.preventDefault()
        const res = await axios.post("http://localhost:3000/api/logout",{withCredentials:true})
        localStorage.removeItem('token');
        navigate('/login')
        
    };

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

                    {/* Desktop Menu */}
                    <ul className="hidden md:flex gap-10">
                        <li
                            className="hover:cursor-pointer hover:text-blue-500"
                            onClick={() => navigate("/products")}
                        >
                            Products
                        </li>
                        <li className="hover:cursor-pointer hover:text-blue-500">Categories</li>
                        <li className="hover:cursor-pointer hover:text-blue-500">About</li>
                        <li className="hover:cursor-pointer hover:text-blue-500">Contact</li>
                    </ul>

                    {/* Icons */}
                    <div className="flex gap-7 justify-center items-center">
                        {/* Profile Icon */}
                        <div className="flex justify-center">
                            <lord-icon
                                src="https://cdn.lordicon.com/hoetzosy.json"
                                trigger="hover"
                                stroke="bold"
                                colors="primary:#ffffff"
                                style={{ width: "20px" }}
                            ></lord-icon>
                        </div>

                        {/* Login / Logout Icon */}
                        {isUser && (
                            <div
                                className="flex justify-center hover:cursor-pointer"
                                onClick={handleLogout}
                                
                            >
                                <lord-icon
                                    src="https://cdn.lordicon.com/vfiwitrm.json"
                                    trigger="hover"
                                    stroke="bold"
                                    colors="primary:#ffffff,secondary:#ffffff"
                                    style={{ width: "20px" }}
                                ></lord-icon>
                            </div>
                        ) } 
                        {!isUser&&(
                            <div
                                className="flex justify-center hover:cursor-pointer"
                                onClick={() => navigate("/login")}
                                title="Login"
                            >
                                <lord-icon
                                    src="https://cdn.lordicon.com/kdduutaw.json"
                                    trigger="hove  r"
                                    stroke="bold"
                                    colors="primary:#ffffff,secondary:#ffffff"
                                    style={{ width: "20px" }}
                                ></lord-icon>
                            </div>
                        )}

                        {/* Cart Icon */}
                        <div
                            className="flex justify-center hover:cursor-pointer"
                            onClick={() => navigate("/cart")}
                        >
                            <lord-icon
                                src="https://cdn.lordicon.com/ggirntso.json"
                                trigger="hover"
                                stroke="bold"
                                colors="primary:#ffffff,secondary:#ffffff"
                                style={{ width: "20px" }}
                            ></lord-icon>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="flex justify-center md:hidden">
                            <FontAwesomeIcon icon={faBars} />
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
};
