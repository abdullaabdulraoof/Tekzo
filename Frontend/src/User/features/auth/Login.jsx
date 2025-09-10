import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {useGoogleLogin} from "@react-oauth/google"
import axios from 'axios';
import { googleAuth } from '../../../pages/user/api';

export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const responseGoogle = async (authResult) => {
        try {
            if (authResult.code) {
                const result = await googleAuth(authResult.code);
                const { email, username } = result.data.user;

                console.log("Google user:", result.data.user);

                // store token
                localStorage.setItem("userToken", result.data.token);
                navigate("/");
            }
        } catch (err) {
            console.log("while requesting the Google code:", err);
        }
    };

    const googleLogin = useGoogleLogin({
        onSuccess: responseGoogle,
        onError: responseGoogle,
        flow: 'auth-code'


    })
    const handleLogin =async (e)=>{
        e.preventDefault()
        try{
            const res = await axios.post("https://tekzo.onrender.com/api/login",{email,password},{withCredentials:true})
        if(res.data.token){
            console.log(res.data.token);
            
            localStorage.setItem("userToken", res.data.token);
            navigate("/")
        }}catch(err){
            console.log(err);
            
        }
        
    }


    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#0A0C10] via-[#1A1D24] to-[#111318] text-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,hsl(217,91%,60%)_0%,transparent_70%)] opacity-20"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(270,95%,75%)_0%,transparent_70%)] opacity-10"></div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="container m-auto">
                    <div className="bg-gradient-to-br from-[#0b1e37] via-[#362352] to-[#a14274] rounded-lg p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0 shadow-2xl">
                        <h2 className="text-white text-lg font-bold title-font mb-5 text-center">
                            Welcome to <span className="text-[#5694F7]">Tekzo!</span>
                        </h2>

                        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

                        <form onSubmit={handleLogin}>
                            <div className="relative mb-4">
                                <label htmlFor="email" className="leading-7 text-sm text-white">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-black/50 rounded border border-gray-300/20 focus:border-indigo-500 focus:ring-2 outline-none py-1 px-3 leading-8 transition-colors duration-200 ease-in-out text-white"
                                />
                            </div>

                            <div className="relative mb-4">
                                <label htmlFor="password" className="leading-7 text-sm text-white">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-black/50 rounded border border-gray-300/20 focus:border-indigo-500 focus:ring-2 outline-none py-1 px-3 leading-8 transition-colors duration-200 ease-in-out text-white"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full text-white bg-[#5694F7] py-2 px-8 rounded-md font-bold text-sm gap-2 transform transition-all duration-500 ease-in-out hover:shadow-[0_0_12px_#5694F7] hover:scale-x-105"
                            >
                                Login
                            </button>
                        </form>

                        <p
                            className="text-sm text-white mt-3 hover:text-[#5694F7] hover:cursor-pointer"
                            onClick={() => navigate('/signup')}
                        >
                            Sign up
                        </p>

                        <div>
                            <button
                                type="submit"
                                className="w-full text-white bg-[#5694F7] py-2 px-8 rounded-md font-bold text-sm gap-2 transform transition-all duration-500 ease-in-out hover:shadow-[0_0_12px_#5694F7] hover:scale-x-105" onClick={googleLogin}
                            >
                                sign with google
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
