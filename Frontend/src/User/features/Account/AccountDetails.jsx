import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import './Order.css';
import { Sidebar } from './Sidebar';

export const AccountDetails = () => {
    const token = localStorage.getItem("userToken")
    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')


    useEffect(() => {
        if (!token) {
            console.error("No token found! Please login.");
            navigate("/login");
        }
    }, [token, navigate]);

    

    useEffect(() => {
        const fetchAccount = async () => {
            try {

                const res = await axios.get('https://tekzo.onrender.com/api/account', { headers: { Authorization: `Bearer ${token}` }, withCredentials: true })
               

                setUser(res.data)
                const usernames = res.data
                setUsername(usernames.username)
                setEmail(usernames.email)
            } catch (err) {
                console.error('Error fetching account:', err);
            }
        }
        fetchAccount()
    }, [token])
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await axios.put("https://tekzo.onrender.com/api/account/accountdetails", { username, email }, { headers: { Authorization: `Bearer ${token}` }, withCredentials: true })
           
            
            setUser(res.data.user)
            
        } catch (err) {
            console.log('product failed to add', err);

        }
    }




    return (
        
                

                    


                        <div className='flex flex-col justify-start items-center border border-gray-700/70 p-6 rounded-xl w-[40%] lg:w-[40%] h-[400px] gap-4'>

                            <h1 className='text-xl font-bold text-center'>
                                Personal Info
                            </h1>
                            {user ?
                                (
                                    <div className='flex flex-col justify-between gap-4 w-full'>
                                        <div className='flex gap-3 text-gray-400 text-sm pt-2 '>
                                            <div className='flex gap-2'>

                                                <label>Fullname : </label>
                                                <input className="rounded-xl px-2 py-2 text-sm bg-black border border-gray-400/20 outline-none" type="text" value={username} onChange={(e) => {
                                                    setUsername(e.target.value)
                                                }} />
                                            </div>
                                            <div className='flex gap-2'>

                                                <label>Email : </label>
                                                <input className="rounded-xl px-2 py-2 text-sm bg-black border border-gray-400/20 outline-none" type="text" value={email} onChange={(e) => {
                                                    setEmail(e.target.value)
                                                }} />
                                            </div>
                                         </div>
                                         <div >

                                            <button
                                                className='flex justify-center items-center w-full bg-[#5694F7] py-2 px-3 rounded-xl text-xs gap-3 cursor-pointer text-white transform transition-all duration-500 ease-in-out hover:shadow-[0_0_12px_#5694F7] hover:scale-x-105'
                                                onClick={handleSubmit}
                                            >
                                                <span className='font-bold'>Save Changes</span>
                                            </button>
                                        </div>


                                    </div>



                                ) : (<p className='text-gray-400'>Loading account details...</p>)}
                        </div>


            
    )
}
