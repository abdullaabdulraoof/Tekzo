import { useNavigate, useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export const EditProductList = () => {
  const { id } = useParams();
  const [name, setName] = useState('')
  const [sku, setSku] = useState('')
  const [desc, setDesc] = useState('')
  const [price, setPrice] = useState('')
  const [offerPrice, setOfferPrice] = useState('')
  const [image, setImage] = useState('')
  const [category, setCategory] = useState('Electronics');
  const [tag, setTag] = useState('')
  const [stockQty, setStockQty] = useState('')
  const [productStatus, setProductStatus] = useState('Active');
  const [error, setError] = useState('');
  const [existingImage, setExistingImage] = useState('');
  const [previewImage, setPreviewImage] = useState('');


  const navigate = useNavigate()

  useEffect(() => {
    axios.get(`http://localhost:3000/admin/Editproduct/${id}`, { withCredentials: true })
      .then(res => {
        const data = res.data;
        setName(data.name || '')
        setSku(data.sku || '')
        setDesc(data.desc || '')
        setPrice(data.price || '')
        setOfferPrice(data.offerPrice || '')
        setCategory(data.category || 'Electronics')
        setTag(data.tag || '');
        setStockQty(data.stockQty || '');
        setProductStatus(data.productStatus || 'Active');
        if (data.imageUrls && data.imageUrls.length > 0) {
          setExistingImage(`http://localhost:3000/${data.imageUrls[0]}`);
        }



      })
      .catch(err => {
        console.log('error fetching product', err);
        setError('could not load product')

      })
  }, [id])




  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('sku', sku);
      formData.append('desc', desc);
      formData.append('price', price);
      formData.append('offerPrice', offerPrice);
      formData.append('category', category);
      formData.append('tag', tag);
      formData.append('stockQty', stockQty);
      formData.append('productStatus', productStatus);

      if (image) {
        formData.append('image', image); // Only append if new image chosen
      }

      await axios.put(`http://localhost:3000/admin/Editproduct/${id}`, formData, {
        withCredentials: true, // keep session cookies if needed
      });

      navigate('/admin/productList');
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    }
  };



  return (
    <section className="min-h-screen bg-black text-white ml-[211px]">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2 mx-auto px-4 sm:px-6 lg:px-10 py-8 pb-16">
          <div>

            <h1 className="text-2xl font-bold">Edit Product</h1>
            <p className='text-xs text-gray-400'>Update Product Details</p>
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
                    <input type="text" id="sku" value={sku} className="rounded-xl px-2 py-2 text-sm bg-black border border-gray-400/20 outline-none" name="sku" required
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
                  <h1 className="text-lg font-bold">Product Images</h1>
                </div>

                <div className="flex flex-col gap-2 w-full h-full">
                  {/* Show current image if no preview selected */}
                  {existingImage && !previewImage && (
                    <div className="mb-3">
                      <img
                        src={existingImage}
                        alt="Product"
                        className="max-h-40 object-cover rounded-lg"
                      />
                      <p className="text-xs text-gray-400 mt-1">Current Image</p>
                    </div>
                  )}

                  {/* Show preview if new file selected */}
                  {previewImage && (
                    <div className="mb-3">
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="max-h-40 object-cover rounded-lg"
                      />
                      <p className="text-xs text-green-400 mt-1">New Image Preview</p>
                    </div>
                  )}

                  <input
                    type="file"
                    id="image"
                    className="rounded-xl px-2 py-2 text-sm bg-black border border-gray-400/20 outline-none h-full"
                    name="image"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      setImage(file);
                      if (file) {
                        setPreviewImage(URL.createObjectURL(file));
                      }
                    }}
                  />
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
                  <h1 className="text-lg font-bold">Product Status</h1>
                </div>


                <div className='flex flex-col gap-2  w-full'>
                  <select type="text" id="productStatus" value={productStatus} className="rounded-xl px-2 py-2 text-sm bg-black border border-gray-400/20 outline-none" name="productStatus" required
                    placeholder="Product SKU" onChange={(e) => {
                      setProductStatus(e.target.value)
                    }}>
                    <option value="Active">Active</option>
                    <option value="Archive">Archive</option>
                  </select>
                </div>
              </div>

            </div>
          </div>
          <div className='flex justify-end w-full '>

            <button className='flex justify-center items-center bg-[#5694F7] rounded-xl font-bold text-xs gap-2 transform transition-all duration-500 ease-in-out hover:shadow-[0_0_12px_#5694F7] hover:scale-x-105 py-2 w-1/4'>
              <span>Update Product</span>
            </button>
          </div>
        </div>
      </form>
    </section>
  )
};
