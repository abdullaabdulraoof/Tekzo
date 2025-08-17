import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const AddProduct = () => {
    const navigate=useNavigate()
    const [name, setName] = useState('')
    const [sku, setSku] = useState('')
    const [desc, setDesc] = useState('')
    const [price, setPrice] = useState('')
    const [offerPrice, setOfferPrice] = useState('')
    const [image, setImage] = useState([])
    const [category, setCategory] = useState('Electronics');
    const [tag, setTag] = useState('')
    const [stockQty, setStockQty] = useState('')
    const [brandName, setBrandName] = useState('')

    const handleImageChange = (e) => {
        setImage([...image, ...e.target.files])
    }
    const handleDeleteImage = (index) => {
        setImage(image.filter((_, i) => i !== index));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formdata = new FormData()
        formdata.append("name", name)
        formdata.append("sku", sku)
        formdata.append("desc", desc)
        formdata.append("price", price)
        formdata.append("offerPrice", offerPrice)
        image.forEach((img) => {
            formdata.append("images", img)
        })
        formdata.append("category", category)
        formdata.append("tag", tag)
        formdata.append("stockQty", stockQty)
        formdata.append("brandName", brandName)

        try{
            const res = await axios.post('http://localhost:3000/api/admin/addproduct',formdata,{
                headers:{"Content-Type":"multipart/form-data"}
            })
            navigate('/admin/productList')
            console.log('product added');
            
        }catch(err){
            console.log('product failed to add', err);
            
        }
    };


    return (
        <section className="min-h-screen bg-black text-white ml-[211px]">
            <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-2 mx-auto px-4 sm:px-6 lg:px-10 py-8 pb-16">
                    <div>

                        <h1 className="text-2xl font-bold">Add Product</h1>
                        <p className='text-xs text-gray-400'>Create a new product for your store</p>
                    </div>

                    <div className='flex gap-3 py-4 px-2 rounded-lg h-[90vh]'>
                        <div className='flex flex-col justify-start gap-6 w-full h-full rounded-lg'>
                            <div className='flex flex-col gap-5 border border-gray-400/20 p-4 rounded-xl'>
                                <div>
                                    <h1 className="text-lg font-bold">Product Information</h1>
                                </div>
                                <div className="flex  w-full gap-4 text-white">
                                    <div className='flex flex-col gap-2 w-1/2'>
                                        <label className='text-xs font-bold'>Product Name</label>
                                        <input type="text" id="name" value={name} className="rounded-xl px-2 py-2 text-sm bg-black border border-gray-400/20 outline-none" name="name" required
                                            placeholder="Enter Product Name" onChange={(e) => {
                                                setName(e.target.value)
                                            }}></input>
                                    </div>

                                    <div className='flex flex-col gap-2  w-1/2'>
                                        <label className='text-xs font-bold'>SKU</label>
                                        <input type="number" id="sku" value={sku} className="rounded-xl px-2 py-2 text-sm bg-black border border-gray-400/20 outline-none" name="sku" required
                                            placeholder="Product SKU" onChange={(e) => {
                                                setSku(e.target.value)
                                            }}></input>
                                    </div>
                                </div>

                                <div className='flex flex-col gap-2  w-full '>
                                    <label className='text-xs font-bold'>Description</label>
                                    <textarea type="text" id="desc" value={desc} className="rounded-xl px-2 py-2 text-sm bg-black border border-gray-400/20 outline-none h-[100px]" name="desc" required
                                        placeholder="Enter Product Description" onChange={(e) => {
                                            setDesc(e.target.value)
                                        }}></textarea>
                                </div>

                                <div className="flex  w-full gap-4 text-white">
                                    <div className='flex flex-col gap-2 w-1/2'>
                                        <label className='text-xs font-bold'>Price</label>
                                        <input type="text" id="price" value={price} className="rounded-xl px-2 py-2 text-sm bg-black border border-gray-400/20 outline-none" name="price" required
                                            placeholder="$$$$" onChange={(e) => {
                                                setPrice(e.target.value)
                                            }}></input>
                                    </div>

                                    <div className='flex flex-col gap-2  w-1/2'>
                                        <label className='text-xs font-bold'>Offer Price</label>
                                        <input type="text" id="offerPrice" value={offerPrice} className="rounded-xl px-2 py-2 text-sm bg-black border border-gray-400/20 outline-none" name="offerPrice" required
                                            placeholder="Product SKU" onChange={(e) => {
                                                setOfferPrice(e.target.value)
                                            }}></input>
                                    </div>
                                </div>
                            </div>

                            <div className='flex flex-col gap-4 border border-gray-400/20 p-4 rounded-xl h-full'>
                                <div>
                                    <h1 className="text-lg font-bold">Product Images </h1>
                                </div>

                                <div className='flex flex-col gap-2  w-full h-full'>
                                    <input
                                        type="file"
                                        className="rounded-xl px-2 py-2 text-sm bg-black border border-gray-400/20 outline-none h-[90px]"
                                        name="image"
                                        multiple
                                        accept="image/*"
                                        // for storing multiple images 
                                        onChange={handleImageChange}
                                        required
                                    />
                                    <div className='flex gap-2 w-full h-[50px]'>
                                        {image.map((img, index) => (
                                            <div key={index} className='relative h-fit w-fit'>
                                                <img key={index} src={URL.createObjectURL(img)} alt="" className='w-[70px] h-[55px] rounded-xl' />
                                                <div className='absolute right-0 top-0' onClick={()=>{handleDeleteImage(index)}}>
                                                    <lord-icon
                                                        src="https://cdn.lordicon.com/vgpkjbvw.json"
                                                        trigger="hover"
                                                        colors="primary:#e83a30"
                                                        style={{ width: "20px" }}>
                                                    </lord-icon>
                                                </div>
                                            </div>
                                        ))}

                                    </div>


                                </div>


                            </div>

                        </div>

                        <div className='flex flex-col gap-4 justify-between w-1/2 h-full rounded-lg'>
                            <div className='flex flex-col gap-3 border border-gray-400/25 rounded-lg p-2 px-4 py-4 h-1/2'>

                                <div>
                                    <h1 className="text-lg font-bold">Product Organization</h1>
                                </div>
                                <div className='flex flex-col gap-2  w-full'>
                                    <label className='text-xs font-bold'>Category</label>
                                    <select type="text" id="category" value={category} className="rounded-xl px-2 py-2 text-sm bg-black border border-gray-400/20 outline-none" name="category" required onChange={(e) => {
                                        setCategory(e.target.value)
                                    }}>
                                        <option value="Electronics">Electronics</option>
                                        <option value="PC">PC</option>
                                        <option value="Laptop">Laptop</option>
                                    </select>
                                </div>

                                <div className='flex flex-col gap-2  w-full'>
                                    <label className='text-xs font-bold'>Tag</label>
                                    <input type="text" id="tag" value={tag} className="rounded-xl px-2 py-2 text-sm bg-black border border-gray-400/20 outline-none " name="tag" required
                                        placeholder="Add a Tag" onChange={(e) => {
                                            setTag(e.target.value)
                                        }}></input>
                                </div>
                            </div>



                            <div className='flex flex-col gap-5 border border-gray-400/25 rounded-lg p-2 px-4  py-4 h-1/2'>

                                <div>
                                    <h1 className="text-lg font-bold">Inventory</h1>
                                </div>


                                <div className='flex flex-col gap-2  w-full'>
                                    <label className='text-xs font-bold'>Stock Quantity</label>
                                    <input type="number" id="stockQty" value={stockQty} className="rounded-xl px-2 py-2 text-sm bg-black border border-gray-400/20 outline-none " name="stockQty" required
                                        placeholder="0" onChange={(e) => {
                                            setStockQty(e.target.value)
                                        }}></input>
                                </div>
                            </div>

                            <div className='flex flex-col gap-5 border border-gray-400/25 rounded-lg p-2 px-4  py-4 h-1/3'>

                                <div>
                                    <h1 className="text-lg font-bold">Brand Name</h1>
                                </div>


                                <div className='flex flex-col gap-2  w-full'>
                                    <input type="text" id="brandName" value={brandName} className="rounded-xl px-2 py-2 text-sm bg-black border border-gray-400/20 outline-none " name="brandName" required
                                        placeholder=".inc" onChange={(e) => {
                                            setBrandName(e.target.value)
                                        }}></input>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className='flex justify-end w-full '>

                        <button type='submit' className='flex justify-center items-center bg-[#5694F7] rounded-xl font-bold text-xs gap-2 transform transition-all duration-500 ease-in-out hover:shadow-[0_0_12px_#5694F7] hover:scale-x-105 py-2 w-1/4' 
                        >
                            <span>Add Product</span>
                        </button>
                    </div>
                </div>
            </form>
        </section>
    )
}
