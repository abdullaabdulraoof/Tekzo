import { React } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';


export const Banner2 = () => {
    const navigate = useNavigate()
    return (
        <section className='bg-black text-white'>
            <div className='py-24 container m-auto items-center pb-2'>


                <div className='flex flex-wrap gap-10 overflow-hidden h-fit justify-center items-center myContainer mx-auto px-4 md:px-10 lg:px-60 py-2 '>

                    <div className="grid grid-cols-6 gap-6 w-full h-[300px]">


                        <div className="col-span-2 relative rounded-xl bg-cover bg-center bg-[url('/banner2/airpods.webp')] transform translate-all duration-500 ease-in-out hover:shadow-[0_0_12px_#5694F7] hover:scale-x-105">
                        </div>

                        <div className="col-span-2 relative rounded-xl bg-cover bg-center bg-[url('/banner2/watch.webp')] transform translate-all duration-500 ease-in-out hover:shadow-[0_0_12px_#5694F7] hover:scale-x-105">
                        </div>
                        <div className="col-span-2 relative rounded-xl bg-cover bg-center bg-[url('/banner2/PC.webp')] transform translate-all duration-500 ease-in-out hover:shadow-[0_0_12px_#5694F7] hover:scale-x-105">
                        </div>




                    </div>

                </div>
            </div>
        </section>
    )
}
