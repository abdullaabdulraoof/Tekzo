import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom'



export const Navbar = () => {
    const navigate = useNavigate();
    return (
        <header >
            <nav className=' bg-black text-white w-full fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg '>
                <div className='flex h-16 justify-between items-center myContainer mx-auto px-4 md:px-10 lg:px-60 py-8'>
                    <div className="logo font-bold text-2xl text-[#5694F7] hover:cursor-pointer" onClick={() => navigate('/')}>
                    <h1>Tekzo</h1>
                    </div>
                
                    <ul className='hidden md:flex gap-10'>
                        <li className='hover:cursor-pointer hover:text-blue-500' onClick={()=>{
                            navigate('/products')
                        }}>Products</li>
                        <li className='hover:cursor-pointer hover:text-blue-500'>Categories</li>
                        <li className='hover:cursor-pointer hover:text-blue-500'>About</li>
                        <li className='hover:cursor-pointer hover:text-blue-500'>Contact</li>
                    </ul>
                
                    <div className='flex gap-7 justify-center items-center'>
                        <div className='flex justify-center'>
                            <lord-icon
                                src="https://cdn.lordicon.com/hoetzosy.json"
                                trigger="hover"
                                    stroke="bold"
                                colors="primary:#ffffff"
                                    style={{ width: "20px" }}>
                            </lord-icon>
                        </div>

                            <div className='flex justify-center hover:cursor-pointer' onClick={()=>{
                                navigate("/login")
                            }}>
                            <lord-icon
                                    src="https://cdn.lordicon.com/kdduutaw.json"
                                    trigger="hover"
                                    stroke="bold"
                                    colors="primary:#ffffff,secondary:#ffffff"
                                    style={{ width: "20px"}}>
                            </lord-icon>
                        </div>

                        <div className='flex justify-center hover:cursor-pointer' onClick={()=>{
                            navigate('/cart')}}>
                            <lord-icon
                                    src="https://cdn.lordicon.com/ggirntso.json"
                                    trigger="hover"
                                    stroke="bold"
                                    colors="primary:#ffffff,secondary:#ffffff"
                                    style={{ width: "20px"}}>
                            </lord-icon>
                        </div>

                        <div className='flex justify-center md:hidden'>
                            <FontAwesomeIcon icon={faBars} />

                        </div>

                    </div>
                </div>

            </nav>
        </header>
    )
}
