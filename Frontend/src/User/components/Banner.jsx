import { React } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';


export const Banner = () => {
    const navigate = useNavigate()
    return (
        <section className='bg-black text-white'>
            <div className='py-24 container m-auto items-center pb-2'>


                <div className='flex flex-wrap gap-10 overflow-hidden h-fit justify-center items-center myContainer mx-auto px-4 md:px-10 lg:px-60 py-2 '>

                    <div className=" grid-cols-1 md:grid-cols-2 gap-6 w-full h-[300px]">


                        <div className="relative rounded-xl bg-cover bg-center bg-[url('/banner/s22.png')] transform translate-all duration-500 ease-in-out hover:shadow-[0_0_12px_#5694F7] hover:scale-x-105">
                        </div>

                        <div className="relative rounded-xl bg-cover bg-center bg-[url('/banner/ipad.png')] transform translate-all duration-500 ease-in-out hover:shadow-[0_0_12px_#5694F7] hover:scale-x-105">
                        </div>


                        

                    </div>

                </div>
            </div>
        </section>
    )
}
