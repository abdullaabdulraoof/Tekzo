import React, { useRef, useEffect, useState } from 'react';
import './Order.css';
import axios from 'axios';
import $ from 'jquery';
import DataTable from 'datatables.net-dt';
import 'datatables.net-responsive-dt';
import { useNavigate } from 'react-router-dom';

export const Order = () => {
    const token = localStorage.getItem("token");
    const tableRef = useRef(null);
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            console.error("No token found! Please login.");
            navigate("/admin/login");
        }
    }, [token, navigate]);

    // Fetch users
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await axios.get('http://localhost:3000/api/admin/ordersList', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                console.log("Fetched users:", res.data.orders);
                setOrders(res.data.orders || []);
            } catch (err) {
                console.error('Error fetching users:', err);
            }
        };
        fetchUsers();
    }, [token]);

    // Initialize DataTable AFTER users are loaded
    useEffect(() => {
        if (
            tableRef.current &&
            !$.fn.dataTable.isDataTable(tableRef.current) &&
            orders.length > 0
        ) {
            $(tableRef.current).DataTable({
                responsive: true
            });
        }
    }, [orders]);

    return (
        <section className="min-h-screen bg-black text-white ml-[211px]">
            <div className="flex flex-col gap-6 mx-auto px-4 sm:px-6 lg:px-10 py-8 pb-16">
                <div>
                    <h1 className="text-2xl font-bold">All Users</h1>
                    <p className='text-xs text-gray-400'>Manage your user list</p>
                </div>
                <div className='flex flex-col gap-3 py-4 px-4 border border-gray-400/25 rounded-lg'>
                    <h1 className="text-xl font-bold">Users</h1>
                    <div className='flex flex-col gap-3'>
                        <table ref={tableRef} id="myTable" className="table mt-5 text-xs w-full">
                            <thead>
                                <tr className='border-b border-gray-500/40'>
                                    <th className='text-xs py-4 text-gray-400'>Order ID</th>
                                    <th className='text-xs py-4 text-gray-400'>Customer</th>
                                    <th className='text-xs py-4 text-gray-400'>Date</th>
                                    <th className='text-xs py-4 text-gray-400'>Items</th>
                                    <th className='text-xs py-4 text-gray-400'>Total</th>
                                    <th className='text-xs py-4 text-gray-400'>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((o) => (
                                    <tr id={`row-${o._id}`} key={o._id} className='border-b border-gray-500/40'>
                                        <td className='text-center text-xs'>{o._id}</td>
                                        <td className='text-center text-xs py-4'>{o.user}</td>
                                        <td className='text-center text-xs py-4'>
                                            {o.createdAt}
                                        </td>
                                        <td className='text-center text-xs py-4'>
                                            {o.products.length}
                                        </td>
                                        <td className='text-center text-xs py-4'>
                                            {o.totalAmount}
                                        </td>
                                        <td className='text-center text-xs py-4'>
                                            {o.status}
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
