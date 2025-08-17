import React, { useRef, useEffect, useState } from 'react';
import './Products.css';
import axios from 'axios';
import $ from 'jquery';
import DataTable from 'datatables.net-dt';
import 'datatables.net-responsive-dt';
import { useNavigate } from 'react-router-dom';


export const Products = () => {
    const tableRef = useRef(null);
    const [products, setProducts] = useState([]);
    const navigate = useNavigate()
    // Fetch products
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get('http://localhost:3000/admin/productList', {
                    withCredentials: true
                });
                console.log("Fetched products:", res.data.product);
                setProducts(res.data.product || []);
            } catch (err) {
                console.error('Error fetching products:', err);
            }
        };
        fetchProducts();
    }, []);

    // Initialize DataTable ***AFTER*** products are present
    useEffect(() => {
        if (
            tableRef.current &&
            !$.fn.dataTable.isDataTable(tableRef.current) &&
            products.length > 0
        ) {
            $(tableRef.current).DataTable({
                responsive: true
            });
        }
    }, [products]); // IMPORTANT: depend on products


    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;
        try {
            await axios.delete(`http://localhost:3000/admin/delete-product/${id}`, {
                withCredentials: true
            });
            setProducts(prevProducts => prevProducts.filter(p => p._id !== id));
        } catch (err) {
            console.error('Delete failed', err);
            if (err.response?.status === 401) {
                window.location.href = '/admin/login';
            }
        }
    };

    const handleEdit = (id)=>{
        navigate(`/admin/productList/Editproduct/${id}`)
    }

    return (
        <section className="min-h-screen bg-black text-white ml-[211px]">
            <div className="flex flex-col gap-6 mx-auto px-4 sm:px-6 lg:px-10 py-8 pb-16">
                <div>
                    <h1 className="text-2xl font-bold">All Products</h1>
                    <p className='text-xs text-gray-400'>Manage your product catalog</p>
                </div>
                <div className='flex flex-col gap-3 py-4 px-4 border border-gray-400/25 rounded-lg'>
                    <h1 className="text-xl font-bold">Products</h1>
                    <div className='flex flex-col gap-3'>
                        <table ref={tableRef} id="myTable" className="table mt-5 text-xs w-full">
                            <thead>
                                <tr className='border-b border-gray-500/40'>
                                    <th className='text-xs py-4 text-gray-400'>Image</th>
                                    <th className='text-xs py-4 text-gray-400'>Name</th>
                                    <th className='text-xs py-4 text-gray-400'>Category</th>
                                    <th className='text-xs py-4 text-gray-400'>Price</th>
                                    <th className='text-xs py-4 text-gray-400'>Stock</th>
                                    <th className='text-xs py-4 text-gray-400'>Status</th>
                                    <th className='text-xs py-4 text-gray-400'>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((p) => (
                                    <tr id={`row-${p._id}`} key={p._id} className='border-b border-gray-500/40'>
                                        <td className='flex justify-center items-center py-4'>
                                            {p.imageUrls && p.imageUrls.length > 0 ? (
                                                <img
                                                    src={`http://localhost:3000/${p.imageUrls[0]}`}
                                                    alt={p.name}
                                                    className='w-[50px] h-[50px] object-cover rounded'
                                                />
                                            ) : (
                                                <span className='text-gray-500 text-xs'>No Image</span>
                                            )}
                                        </td>

                                        <td className='text-center text-xs'>{p.name}</td>
                                        <td className='text-center text-xs py-4'>{p.category}</td>
                                        <td className='text-center text-xs py-4'>{p.price}</td>
                                        <td className='text-center text-xs py-4'>{p.stockQty}</td>
                                        <td className='text-center text-xs py-4'>{p.productStatus}</td>
                                        <td className='text-xs py-4 text-gray-400'>
                                            <div className='flex justify-center items-center gap-3'>
                                                <button
                                                    className="flex justify-center items-center w-fit bg-red-600 text-white outline outline-gray-800 outline-2 py-1 px-2 rounded-xl text-xs gap-3 cursor-pointer hover:bg-red-800"
                                                    onClick={() => handleDelete(p._id)}
                                                >
                                                    <span className='font-bold'>Delete</span>
                                                </button>
                                                <button
                                                    className='flex justify-center items-center w-fit bg-white outline outline-gray-800 outline-2 py-1 px-2 rounded-xl text-xs gap-3 cursor-pointer hover:bg-gray-200'
                                                    onClick={() => handleEdit(p._id)}
                                                >
                                                    <span className='text-black font-bold'>Edit</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </section>
    );
};
