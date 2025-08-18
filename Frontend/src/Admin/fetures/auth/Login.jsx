import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';

export const Login = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const handleLogin = async(e)=>{
        e.preventDefault()
        try{
            const res = await axios.post("http://localhost:3000/api/admin/login", {username,password} ,
                 {withCredentials:true})
            if(res.data.token){
                localStorage.setItem("token", res.data.token);
                navigate("/admin/");
            }else{
                if (err.response && err.response.data && err.response.data.message) {
                    setError(err.response.data.message);
                } else {
                    setError("Login failed. Try again.");
                }

            }
            
        }catch(err){
            console.log('Erro', err);
            
        }
        
    }
   


    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#0A0C10] via-[#1A1D24] to-[#111318] text-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,hsl(217,91%,60%)_0%,transparent_70%)] opacity-20"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(270,95%,75%)_0%,transparent_70%)] opacity-10"></div>
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className='container m-auto'>
                    <form onSubmit={handleLogin}>
                        <div className=" bg-gradient-to-br from-[#0b1e37] via-[#362352] to-[#a14274] rounded-lg p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0 shadow-2xl">
                            <h2 className="text-white text-lg font-bold title-font mb-5 text-center">
                                <span className='text-[#5694F7]'>Admin Panel</span>
                            </h2>
                            <div className="relative mb-4">
                                <label className="leading-7 text-sm text-white">Username</label>
                                <input type="text" id="name" value={username} name="email" className="w-full bg-black/50 rounded border border-gray-300/20 focus:border-indigo-500 focus:ring-2 focus:nonetext-base outline-none py-1 px-3 leading-8 transition-colors duration-200 ease-in-out text-white" onChange={(e) => {
                                    setUsername(e.target.value)
                                }} />
                            </div>
                            <div className="relative mb-4">
                                <label className="leading-7 text-sm text-white">Password</label>
                                <input type="password" id="password" value={password} name="password" className="w-full bg-black/50 rounded border border-gray-300/20 focus:border-indigo-500 focus:ring-2 focus:nonetext-base outline-none py-1 px-3 leading-8 transition-colors duration-200 ease-in-out text-white" onChange={(e) => {
                                    setPassword(e.target.value)
                                }} />
                            </div>
                            <button className="text-white bg-[#5694F7] py-2 px-8 rounded-md font-bold text-sm gap-2 transform transition-all duration-500 ease-in-out hover:shadow-[0_0_12px_#5694F7] hover:scale-x-105">Login</button>
                            {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
                        </div>
                    </form>
                </div>
            </div>
        </section>
    )
}
