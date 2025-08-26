import { React } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';


export const Banner = () => {
    const navigate = useNavigate()
    return (
        <section className='min-h-screen bg-black text-white'>
            <div className='py-24 container m-auto items-center '>


                <div className='flex flex-wrap gap-10 overflow-hidden h-fit justify-center items-center myContainer mx-auto px-4 md:px-10 lg:px-60 py-2 '>

                    <div className="grid grid-cols-6 gap-6 w-full h-[610px]">


                        <div className="col-span-3 relative rounded-xl bg-cover bg-center bg-[url(src/User/assets/Group6.png)]">
                            <div className='absolute top-14 left-9 w-fit h-[35px] py-2 font-bold rounded-b-xl '>
                                <div className='flex flex-col gap-3 justify-start text-2xl '>
                                    <div className='flex flex-col gap-1'>
                                    <span>Samsung Galaxy</span>
                                    <span>S25 Ultra</span>

                                    </div>
                                    <button className='flex justify-center items-center bg-[#5694F7] py-2 px-2 rounded-xl font-bold text-xs gap-2 transform transition-all duration-500 ease-in-out hover:shadow-[0_0_12px_#5694F7] hover:scale-x-105 w-fit' onClick={() => {
                                        navigate('/products')
                                    }}>
                                        <span>Shop Now</span>
                                    </button>
                                </div>

                            </div>
                        </div>

                        <div className="col-span-3 relative rounded-xl bg-cover bg-center bg-[url(src/User/assets/Group7.png)] ">
                            <div className='absolute top-12 left-44 w-fit h-[35px] py-2 font-bold rounded-b-xl '>
                                <div className='flex flex-col justify-center  gap-3 items-center text-2xl '>

                                        <span>Ipad Pro Max</span>

                                    <button className='flex justify-center items-center bg-[#5694F7] py-2 px-2 rounded-xl font-bold text-xs gap-2 transform transition-all duration-500 ease-in-out hover:shadow-[0_0_12px_#5694F7] hover:scale-x-105 w-fit' onClick={() => {
                                        navigate('/products')
                                    }}>
                                        <span>Shop Now</span>
                                    </button>
                                </div>

                            </div>
                        </div>

                        <div className="col-span-2 relative rounded-xl bg-cover bg-center bg-[url(src/User/assets/Group8.png)]">

                        </div>

                        <div className="col-span-2 relative rounded-xl bg-cover bg-center bg-[url(src/User/assets/Group10.png)]">

                        </div>
                        <div className="col-span-2 relative rounded-xl bg-cover bg-center bg-[url(src/User/assets/pc.jpg)]">

                        </div>

                        

                    </div>

                </div>
            </div>
        </section>
    )
}
