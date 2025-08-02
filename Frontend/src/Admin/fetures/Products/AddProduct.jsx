import React from 'react'

export const AddProduct = () => {
    return (
        <section className="min-h-screen bg-black text-white ml-[211px]">
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
                            <div class="flex  w-full gap-4 text-white">
                                <div className='flex flex-col gap-2 w-1/2'>
                                    <label for="productName" className='text-xs font-bold'>Product Name</label>
                                    <input type="text" id="productName" className="rounded-xl px-2 py-2 text-sm bg-black border border-gray-400/20 outline-none" name="productName" required
                                        placeholder="Enter Product Name"></input>
                                </div>

                                <div className='flex flex-col gap-2  w-1/2'>
                                    <label for="sku" className='text-xs font-bold'>SKU</label>
                                    <input type="text" id="sku" className="rounded-xl px-2 py-2 text-sm bg-black border border-gray-400/20 outline-none" name="sku" required
                                        placeholder="Product SKU"></input>
                                </div>
                            </div>

                            <div className='flex flex-col gap-2  w-full '>
                                <label for="desc" className='text-xs font-bold'>Description</label>
                                <textarea type="text" id="desc" className="rounded-xl px-2 py-2 text-sm bg-black border border-gray-400/20 outline-none h-[100px]" name="desc" required
                                    placeholder="Enter Product Description"></textarea>
                            </div>

                            <div class="flex  w-full gap-4 text-white">
                                <div className='flex flex-col gap-2 w-1/2'>
                                    <label for="price" className='text-xs font-bold'>Price</label>
                                    <input type="text" id="price" className="rounded-xl px-2 py-2 text-sm bg-black border border-gray-400/20 outline-none" name="price" required
                                        placeholder="$$$$"></input>
                                </div>

                                <div className='flex flex-col gap-2  w-1/2'>
                                    <label for="offerPrice" className='text-xs font-bold'>Offer Price</label>
                                    <input type="text" id="offerPrice" className="rounded-xl px-2 py-2 text-sm bg-black border border-gray-400/20 outline-none" name="offerPrice" required
                                        placeholder="Product SKU"></input>
                                </div>
                            </div>
                        </div>

                        <div className='flex flex-col gap-4 border border-gray-400/20 p-4 rounded-xl h-full'>
                            <div>
                                <h1 className="text-lg font-bold">Product Images</h1>
                            </div>

                            <div className='flex flex-col gap-2  w-full h-full'>
                                <input type="file" id="image" className="rounded-xl px-2 py-2 text-sm bg-black border border-gray-400/20 outline-none h-full" name="image" required
                                ></input>
                            </div>


                        </div>

                    </div>

                    <div className='flex flex-col gap-4 justify-between w-1/2 h-full rounded-lg'>
                        <div className='flex flex-col gap-3 border border-gray-400/25 rounded-lg p-2 px-4 py-4 h-1/2'>

                            <div>
                                <h1 className="text-lg font-bold">Product Organization</h1>
                            </div>
                            <div className='flex flex-col gap-2  w-full'>
                                <label for="offerPrice" className='text-xs font-bold'>Category</label>
                                <select type="text" id="offerPrice" className="rounded-xl px-2 py-2 text-sm bg-black border border-gray-400/20 outline-none" name="offerPrice" required
                                    placeholder="Product SKU">
                                    <option value="">Electronics</option>
                                    <option value="">PC</option>
                                    <option value="">Laptop</option>
                                </select>
                            </div>

                            <div className='flex flex-col gap-2  w-full'>
                                <label for="offerPrice" className='text-xs font-bold'>Tag</label>
                                <input type="text" id="offerPrice" className="rounded-xl px-2 py-2 text-sm bg-black border border-gray-400/20 outline-none " name="offerPrice" required
                                    placeholder="Add a Tag"></input>
                            </div>
                        </div>



                        <div className='flex flex-col gap-5 border border-gray-400/25 rounded-lg p-2 px-4  py-4 h-1/2'>

                            <div>
                                <h1 className="text-lg font-bold">Inventory</h1>
                            </div>


                            <div className='flex flex-col gap-2  w-full'>
                                <label for="stockQuantity" className='text-xs font-bold'>Stock Quantity</label>
                                <input type="number" id="stockQuantity" className="rounded-xl px-2 py-2 text-sm bg-black border border-gray-400/20 outline-none " name="stockQuantity" required
                                    placeholder="0"></input>
                            </div>
                        </div>

                        <div className='flex flex-col gap-5 border border-gray-400/25 rounded-lg p-2 px-4  py-4 h-1/3'>

                            <div>
                                <h1 className="text-lg font-bold">Product Status</h1>
                            </div>


                            <div className='flex flex-col gap-2  w-full'>
                                <select type="text" id="productStatus" className="rounded-xl px-2 py-2 text-sm bg-black border border-gray-400/20 outline-none" name="productStatus" required
                                    placeholder="Product SKU">
                                    <option value="">Active</option>
                                    <option value="">Archived</option>
                                </select>
                            </div>
                        </div>

                    </div>
                </div>
                <div className='flex justify-end w-full '>

                    <button className='flex justify-center items-center bg-[#5694F7] rounded-xl font-bold text-xs gap-2 transform transition-all duration-500 ease-in-out hover:shadow-[0_0_12px_#5694F7] hover:scale-x-105 py-2 w-1/4' onClick={() => {
                        navigate('/checkout')
                    }}>
                        <span>Add Product</span>
                    </button>
                </div>
            </div>
        </section>
    )
}
