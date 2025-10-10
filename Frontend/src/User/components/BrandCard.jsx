import React from 'react'
import { useNavigate } from 'react-router-dom'

// Import all images dynamically with Vite
const mobileImages = import.meta.glob('../assets/brands/mobile/*.{png,jpg,jpeg,svg,webp}', { eager: true })
const laptopImages = import.meta.glob('../assets/brands/Laptop/*.{png,jpg,jpeg,svg,webp}', { eager: true })
const audioImages = import.meta.glob('../assets/brands/audio/*.{png,jpg,jpeg,svg,webp}', { eager: true })

// Convert object → array of image paths
const getImages = (images) => Object.values(images).map(module => module.default)

const mobileList = getImages(mobileImages)
const laptopList = getImages(laptopImages)
const audioList = getImages(audioImages)

export const BrandCard = () => {
    const navigate = useNavigate()

    // Create objects with id + name + img
    const mobiles = mobileList.map((img, i) => ({ id: `m${i}`, name: `Mobile ${i + 1}`, img }))
    const laptops = laptopList.map((img, i) => ({ id: `l${i}`, name: `Laptop ${i + 1}`, img }))
    const audios = audioList.map((img, i) => ({ id: `a${i}`, name: `Audio ${i + 1}`, img }))

    // Reusable renderer
    const renderCategory = (title, items) => (
        <div className='py-10 container m-auto items-center'>
            <div className='flex flex-col gap-4 px-4 md:px-10 lg:px-60'>
                <h2 className='text-2xl font-bold'>{title}</h2>
            </div>
            <div className='flex flex-wrap gap-10 overflow-hidden h-fit justify-center items-center myContainer mx-auto px-5 md:px-10 lg:px-60 py-2'>
                <div className="flex justify-start gap-2 w-full px-2 overflow-x-scroll h-500px py-3">
                    {items.map((pro) => (
                        <div key={pro.id} onClick={() => navigate(`/products/productDetails/${pro.id}`)}>
                            <div
                                className="relative rounded-xl bg-cover bg-center transform duration-500 hover:shadow-[0_0_12px_#5694F7] hover:scale-x-105 h-[200px] w-[165px]"
                                style={{ backgroundImage: `url(${pro.img})` }}
                            >
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )

    return (
        <section className='bg-black text-white'>
            {renderCategory("Mobiles", mobiles)}
            {renderCategory("Laptops", laptops)}
            {renderCategory("Audio", audios)}
        </section>
    )
}
