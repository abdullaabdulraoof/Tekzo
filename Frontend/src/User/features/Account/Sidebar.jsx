import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react';
import { loadLordicon } from '../../../utils/loadLordicon';
export const Sidebar = () => {
    useEffect(() => {
        loadLordicon();
    }, []);
    const navigate = useNavigate()
    return (
        <nav className=' bg-black text-white bg-background/80 backdrop-blur-lg w-fit flex-shrink-0 shadow-lg'>
            <div className='flex myContainer mx-auto px-4 md:px-10 lg:px-2 gap-3'>

                <ul className='flex gap-4 text-sm'>

                    <li className='flex items-center gap-2 hover:cursor-pointer hover:bg-gray-400/15 rounded-xl px-4 py-2 border border-gray-700/70 ' 
                        onClick={() => { navigate('/ordersList') }}>
                        <div className="flex">
                            <lord-icon
                                src="https://cdn.lordicon.com/rezibkiy.json"
                                trigger="hover"
                                colors="primary:#ffffff ,secondary:#ffffff"
                                style={{ width: "20px" }}>
                            </lord-icon>
                        </div>
                        <span>Orders</span>
                    </li>




                    <li className='flex items-center gap-2 hover:cursor-pointer hover:bg-gray-400/15 rounded-xl px-4 py-2 border border-gray-700/70'
                        onClick={() => { navigate('/account/wishlist') }}>
                        <div className="flex">
                            <lord-icon
                                src="https://cdn.lordicon.com/efgqjiqt.json"
                                trigger="hover"
                                colors="primary:#ffffff ,secondary:#ffffff"
                                style={{ width: "20px" }}>
                            </lord-icon>
                        </div>
                        <span>Wishlist</span>
                    </li>

                    <li className='flex items-center gap-2 hover:cursor-pointer hover:bg-gray-400/15 rounded-xl px-4 py-2 border border-gray-700/70' onClick={() => { navigate('/account/accountdetails') }}>
                        <div className="flex">
                            <lord-icon
                                src="https://cdn.lordicon.com/kdduutaw.json"
                                trigger="hover"
                                colors="primary:#ffffff ,secondary:#ffffff"
                                style={{ width: "20px" }}>
                            </lord-icon>
                        </div>
                        <span>Profile</span>
                    </li>


                    <li className='flex items-center gap-2 hover:cursor-pointer hover:bg-gray-400/15 rounded-xl px-4 py-2 border border-gray-700/70' onClick={() => { navigate('/account/address') }}>
                        <div className="flex">
                            <lord-icon
                                src="https://cdn.lordicon.com/jfhecnmz.json"
                                trigger="hover"
                                colors="primary:#ffffff ,secondary:#ffffff"
                                style={{ width: "20px" }}>
                            </lord-icon>
                        </div>
                        <span>Address</span>
                    </li>

                </ul>
            </div>

        </nav>
    )
}
