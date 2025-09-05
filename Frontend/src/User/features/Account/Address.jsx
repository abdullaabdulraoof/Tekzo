import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './Order.css'
import { Sidebar } from './Sidebar'

export const Address = () => {
    const token = localStorage.getItem("userToken")
    const navigate = useNavigate()
    const [address, setAddress] = useState('')
    const [pincode, setPincode] = useState('')
    const [country, setCountry] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!token) {
            console.error("No token found! Please login.")
            navigate("/login")
        }
    }, [token, navigate])

    useEffect(() => {
        const fetchAccount = async () => {
            try {
                const res = await axios.get("https://tekzo.onrender.com/api/account", {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true
                })

                console.log(res.data)

                const user = res.data.user
                if (user && user.addresses && user.addresses.length > 0) {
                    // find default address
                    const defaultAddr = user.addresses.find(
                        (addr) => addr._id === user.defaultAddress
                    ) || user.addresses[0] // fallback

                    setAddress(defaultAddr.address)
                    setPincode(defaultAddr.pincode)
                    setCountry(defaultAddr.country)
                }
                setLoading(false)
            } catch (err) {
                console.error("Error fetching account:", err)
            }
        }

        fetchAccount()
    }, [token])

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await axios.put(
                "https://tekzo.onrender.com/api/account/address",
                { address, pincode, country },
                { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
            )
            console.log("Address updated", res.data)
        } catch (err) {
            console.log("Error updating address", err)
        }
    }

    return (
        <section className="min-h-screen bg-black text-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-36 pt-24 pb-16">
                <div className="flex flex-col justify-between items-center pb-4 w-full lg:flex-row gap-2">
                    <h2 className="text-2xl sm:text-3xl font-bold">My Account</h2>
                    <Sidebar />
                </div>

                <div className="w-full h-screen flex justify-center items-center">
                    <div className="flex flex-col justify-start items-center border border-gray-700/70 p-6 rounded-xl w-[40%] h-[400px] gap-4">
                        <h1 className="text-xl font-bold">Default Address</h1>

                        {loading ? (
                            <p className="text-gray-400">Loading account details...</p>
                        ) : (
                            <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
                                <div className="flex flex-col gap-3 text-gray-400 text-sm pt-2">
                                    <div className="flex flex-col gap-2">
                                        <label>Address:</label>
                                        <input
                                            className="rounded-xl px-2 py-2 text-sm bg-black border border-gray-400/20 outline-none"
                                            type="text"
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                        />
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label>Pincode:</label>
                                        <input
                                            className="rounded-xl px-2 py-2 text-sm bg-black border border-gray-400/20 outline-none"
                                            type="text"
                                            value={pincode}
                                            onChange={(e) => setPincode(e.target.value)}
                                        />
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label>Country:</label>
                                        <input
                                            className="rounded-xl px-2 py-2 text-sm bg-black border border-gray-400/20 outline-none"
                                            type="text"
                                            value={country}
                                            onChange={(e) => setCountry(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="flex justify-center items-center w-full bg-[#5694F7] py-2 px-3 rounded-xl text-xs gap-3 cursor-pointer text-white transform transition-all duration-500 ease-in-out hover:shadow-[0_0_12px_#5694F7] hover:scale-x-105"
                                >
                                    <span className="font-bold">Save Changes</span>
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}
