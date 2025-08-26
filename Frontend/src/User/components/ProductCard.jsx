import { React } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';


export const ProductCard = () => {
    const navigate = useNavigate()
    return (
        <section className='min-h-screen bg-black text-white'>
            <div className='py-24 container m-auto items-center '>
                <div className='flex flex-col gap-4 text-center'>
                    <h2 className='text-4xl font-bold'>Featured Category</h2>
                    <p className='text-xl text-gray-400'>Discover our carefully curated selection of premium products, designed to<br /> elevate your everyday experience.</p>
                </div>

                <div className='flex flex-wrap gap-10 overflow-hidden h-fit justify-center items-center myContainer mx-auto px-4 md:px-10 lg:px-60 py-8 mt-8 '>

                    <div className="grid grid-cols-3 gap-6 w-full h-[500px]">
                        <div className="relative rounded-xl bg-cover bg-center bg-[url(src/User/assets/pc.jpg)] transform translate-all duration-500 ease-in-out hover:shadow-[0_0_12px_#5694F7] hover:scale-x-105">
                            <div className='absolute bg-gray-900/60 bottom-0 w-full h-[35px] text-center py-2 font-bold rounded-b-xl '>Custom PC</div>
                        </div>

                        <div className=" relative rounded-xl bg-cover bg-center bg-[url(src/User/assets/headphone.jpg)] transform translate-all duration-500 ease-in-out hover:shadow-[0_0_12px_#5694F7] hover:scale-x-105">
                            <div className='absolute bg-gray-900/60 bottom-0 w-full h-[35px] text-center py-2 font-bold rounded-b-xl'>Audio</div>
                        </div>
                        
                        <div className=" relative rounded-xl row-span-2 bg-cover bg-center bg-[url(src/User/assets/mobile.jpg)] transform translate-all duration-500 ease-in-out hover:shadow-[0_0_12px_#5694F7] hover:scale-x-105" >
                            <div className='absolute bg-gray-900/60 bottom-0 w-full h-[35px] text-center py-2 font-bold rounded-b-xl'>Mobile</div>
                        </div>

                        <div className=" relative rounded-xl col-span-2 bg-cover bg-center bg-[url(src/User/assets/keyboard.jpg)] transform transition-all duration-500 ease-in-out hover:shadow-[0_0_12px_#5694F7] hover:scale-x-105">
                        <div className='absolute bg-gray-900/60 bottom-0 w-full h-[35px] text-center py-2 font-bold rounded-b-xl'>Accessories</div>
                        </div>

                    </div>

                </div>
            </div>
        </section>
    )
}
