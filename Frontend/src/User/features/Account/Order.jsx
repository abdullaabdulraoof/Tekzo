import React, { useEffect, useState } from 'react'
import { Sidebar } from './Sidebar'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import { useSocket } from '../../../../context/SocketContext';
import { API_URL } from '../../../config/apiConfig';
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    getPaginationRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    getExpandedRowModel
} from '@tanstack/react-table'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faChevronDown, faChevronUp, faBox, faCreditCard, faCalendarAlt, faArrowRight } from '@fortawesome/free-solid-svg-icons';

export const Order = () => {
    const token = localStorage.getItem("userToken")
    const navigate = useNavigate()
    const [order, setorder] = useState([])
    const [sorting, setSorting] = useState([])
    const [filtering, setFiltering] = useState('')
    const socket = useSocket()
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 6,
    })

    useEffect(() => {
        if (!token) {
            console.error("No token found! Please login.");
            navigate("/login");
        }
    }, [token, navigate]);

    const fetchOrder = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/ordersList`, { 
                headers: { Authorization: `Bearer ${token}` }, 
                withCredentials: true 
            })

            const fetchedorder = res.data.orders.map((order) => ({
                orderId: order._id,
                status: order.status,
                paymentMethod: order.paymentMethod,
                total: order.totalAmount,
                createdAt: order.createdAt,
                items: order.products.map((p) => ({
                    image: p.product.images[0],
                    name: p.product.name,
                    qty: p.quantity,
                    price: p.product.price
                }))
            }))
            setorder(fetchedorder)
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    }

    useEffect(() => {
        fetchOrder()
    }, [token])

    useEffect(() => {
        if (socket) {
            const handleOrderUpdate = (data) => {
                if (!data.userId || data.userId === localStorage.getItem("userId")) {
                    fetchOrder();
                }
            };
            socket.on("orderPlaced", handleOrderUpdate);
            socket.on("orderStatusChanged", handleOrderUpdate);
            return () => {
                socket.off("orderPlaced", handleOrderUpdate);
                socket.off("orderStatusChanged", handleOrderUpdate);
            }
        }
    }, [socket, token]);

    const columns = [
        { accessorKey: 'orderId', header: 'Order ID' },
        { accessorKey: 'status', header: 'Status' },
        { accessorKey: 'paymentMethod', header: 'PaymentMethod' },
        { accessorKey: 'total', header: 'Total (₹)' },
    ];

    const table = useReactTable({
        data: order,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
        getRowCanExpand: () => true,
        state: { pagination, sorting, globalFilter: filtering },
        onPaginationChange: setPagination,
        onSortingChange: setSorting,
        onGlobalFilterChange: setFiltering,
    })

    const getStatusStyle = (status) => {
        switch (status?.toLowerCase()) {
            case 'paid':
            case 'delivered':
                return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]';
            case 'pending':
            case 'processing':
                return 'bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]';
            case 'failed':
            case 'cancelled':
                return 'bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.1)]';
            default:
                return 'bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]';
        }
    }

    return (
        <section className='min-h-screen bg-black text-white pt-28 pb-20'>
            <div className='container mx-auto px-4 md:px-10 lg:px-60'>
                <div className='mb-10'>
                    <h1 className='text-3xl sm:text-4xl font-bold tracking-tight'>Account</h1>
                    <p className='text-sm sm:text-base text-gray-400 mt-2'>{order.length} total orders placed</p>
                </div>
                <div className='flex flex-col lg:flex-row gap-10 items-start'>
                    {/* Sidebar */}
                    <Sidebar />

                    {/* Main Content */}
                    <div className='flex-1 space-y-6'>
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <h2 className='text-3xl font-bold tracking-tight'>Order History</h2>
                                <p className='text-gray-400 mt-1'>Manage and track your recent purchases</p>
                            </div>
                            
                            <div className="relative w-full sm:w-72 group">
                                <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                                <input
                                    type="text"
                                    value={filtering}
                                    onChange={(e) => setFiltering(e.target.value)}
                                    placeholder="Search orders..."
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-900/40 border border-gray-800 rounded-xl focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-gray-600"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            {table.getRowModel().rows.length > 0 ? (
                                table.getRowModel().rows.map((row) => (
                                    <div 
                                        key={row.id}
                                        className="group bg-gray-900/20 border border-gray-800/50 rounded-2xl overflow-hidden hover:border-gray-700/50 hover:bg-gray-900/30 transition-all duration-300"
                                    >
                                        <div 
                                            className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer"
                                            onClick={row.getToggleExpandedHandler()}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-blue-600/10 flex items-center justify-center border border-blue-500/20 group-hover:scale-110 transition-transform">
                                                    <FontAwesomeIcon icon={faBox} className="w-6 h-6 text-blue-400" />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-bold text-gray-100">#{row.original.orderId.slice(-8).toUpperCase()}</span>
                                                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusStyle(row.original.status)}`}>
                                                            {row.original.status}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                                                        <span className="flex items-center gap-1.5"><FontAwesomeIcon icon={faCreditCard} className="w-3.5 h-3.5" /> {row.original.paymentMethod}</span>
                                                        <span className="w-1 h-1 rounded-full bg-gray-700"></span>
                                                        <span className="flex items-center gap-1.5"><FontAwesomeIcon icon={faCalendarAlt} className="w-3.5 h-3.5" /> {new Date(row.original.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-none border-gray-800/50 pt-4 md:pt-0">
                                                <div className="text-right">
                                                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Total Amount</p>
                                                    <p className="text-lg font-bold text-blue-400">₹{row.original.total.toLocaleString()}</p>
                                                </div>
                                                <div className="w-8 h-8 rounded-full bg-gray-800/50 flex items-center justify-center group-hover:bg-blue-600/20 transition-colors">
                                                    {row.getIsExpanded() ? <FontAwesomeIcon icon={faChevronUp} className="w-4 h-4 text-gray-400" /> : <FontAwesomeIcon icon={faChevronDown} className="w-4 h-4 text-gray-400" />}
                                                </div>
                                            </div>
                                        </div>

                                        {row.getIsExpanded() && (
                                            <div className="border-t border-gray-800/50 bg-black/40 p-6 animate-in fade-in slide-in-from-top-2 duration-300">
                                                <div className="space-y-4">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <h4 className="font-semibold text-gray-200">Order Items</h4>
                                                        <span className="text-xs text-gray-500">{row.original.items.length} items</span>
                                                    </div>
                                                    <div className="grid gap-3">
                                                        {row.original.items?.map((item, idx) => (
                                                            <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-gray-800/20 border border-gray-700/30">
                                                                <div className="flex items-center gap-4">
                                                                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-900 border border-gray-800">
                                                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                                    </div>
                                                                    <div>
                                                                        <p className="font-medium text-gray-200">{item.name}</p>
                                                                        <p className="text-sm text-gray-500">Quantity: {item.qty}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="text-right">
                                                                    <p className="font-bold text-gray-300">₹{item.price.toLocaleString()}</p>
                                                                    <p className="text-[10px] text-gray-500">Subtotal: ₹{(item.price * item.qty).toLocaleString()}</p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    
                                                    <div className="mt-6 p-4 rounded-xl bg-blue-600/5 border border-blue-500/10 flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-full bg-blue-600/10 flex items-center justify-center">
                                                                <FontAwesomeIcon icon={faBox} className="w-5 h-5 text-blue-400" />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-200">Need help with this order?</p>
                                                                <p className="text-xs text-gray-500">Contact our support team for any queries.</p>
                                                            </div>
                                                        </div>
                                                        <button className="flex items-center gap-2 text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors">
                                                            Contact Support <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center py-20 bg-gray-900/20 border border-gray-800/50 rounded-2xl text-center">
                                    <div className="w-16 h-16 rounded-2xl bg-gray-800/50 flex items-center justify-center mb-4">
                                        <FontAwesomeIcon icon={faBox} className="w-8 h-8 text-gray-600" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-300">No orders found</h3>
                                    <p className="text-gray-500 mt-2 max-w-xs">Looks like you haven't placed any orders yet. Start shopping to see your orders here!</p>
                                    <button 
                                        onClick={() => navigate('/products')}
                                        className="mt-6 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-600/20"
                                    >
                                        Go to Shop
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Pagination */}
                        {table.getPageCount() > 1 && (
                            <div className="flex justify-center items-center pt-8 gap-4">
                                <button
                                    onClick={() => table.previousPage()}
                                    disabled={!table.getCanPreviousPage()}
                                    className="px-5 py-2 bg-gray-900/40 border border-gray-800 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-800/60 transition-colors text-sm font-medium"
                                >
                                    Previous
                                </button>

                                <div className="flex items-center gap-2 px-4 py-2 bg-gray-900/40 border border-gray-800 rounded-xl text-sm">
                                    <span className="text-gray-400">Page</span>
                                    <span className="font-bold text-blue-400">{table.getState().pagination.pageIndex + 1}</span>
                                    <span className="text-gray-600">/</span>
                                    <span className="text-gray-400">{table.getPageCount()}</span>
                                </div>

                                <button
                                    onClick={() => table.nextPage()}
                                    disabled={!table.getCanNextPage()}
                                    className="px-5 py-2 bg-gray-900/40 border border-gray-800 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-800/60 transition-colors text-sm font-medium"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}

