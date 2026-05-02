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
import { faSearch, faChevronDown, faChevronUp, faBox, faCreditCard, faCalendarAlt, faArrowRight, faCheckCircle, faClock, faUndo, faTimesCircle, faUpload, faTimes, faImage } from '@fortawesome/free-solid-svg-icons';
import { toast, ToastContainer } from 'react-toastify';

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

    // Request Modal State
    const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
    const [activeOrderId, setActiveOrderId] = useState(null);
    const [requestType, setRequestType] = useState(''); // 'cancel' or 'return'
    const [requestReason, setRequestReason] = useState('');
    const [returnImages, setReturnImages] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

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
                trackingHistory: order.trackingHistory || [],
                request: order.request || { requestType: 'none', status: 'none' },
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

    const handleRequestSubmit = async () => {
        if (!requestReason.trim()) {
            toast.error("Please provide a reason");
            return;
        }
        if (requestType === 'return' && returnImages.length === 0) {
            toast.error("Please upload at least one image as proof");
            return;
        }

        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('type', requestType);
            formData.append('reason', requestReason);
            returnImages.forEach((img) => {
                formData.append('images', img);
            });

            await axios.post(`${API_URL}/api/orders/${activeOrderId}/request`, formData, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });

            toast.success(`${requestType === 'cancel' ? 'Cancellation' : 'Return'} request submitted!`);
            setIsRequestModalOpen(false);
            fetchOrder();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to submit request");
        } finally {
            setIsSubmitting(false);
        }
    }

    const openRequestModal = (orderId, type) => {
        setActiveOrderId(orderId);
        setRequestType(type);
        setRequestReason('');
        setReturnImages([]);
        setIsRequestModalOpen(true);
    };

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
        <>
        <section className='min-h-screen bg-black text-white pt-28 pb-20'>
            <ToastContainer theme="dark" />
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
                                                    
                                                    {/* Tracking Timeline */}
                                                    <div className="mt-8 border-t border-gray-800/50 pt-6">
                                                        <h4 className="font-semibold text-gray-200 mb-6 flex items-center gap-2">
                                                            <FontAwesomeIcon icon={faClock} className="text-blue-400 w-4 h-4" />
                                                            Order Tracking
                                                        </h4>
                                                        
                                                        <div className="relative">
                                                            {/* Vertical Line */}
                                                            <div className="absolute left-3 top-3 bottom-3 w-[2px] bg-gray-800"></div>
                                                            
                                                            <div className="space-y-8">
                                                                {/* Base "Placed" step if history is empty */}
                                                                {row.original.trackingHistory.length === 0 && (
                                                                    <div className="relative flex gap-6 items-start">
                                                                        <div className="z-10 w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center border-4 border-black">
                                                                            <FontAwesomeIcon icon={faCheckCircle} className="w-3 h-3 text-white" />
                                                                        </div>
                                                                        <div>
                                                                            <p className="text-sm font-bold text-gray-100 uppercase tracking-wider">Order Placed</p>
                                                                            <p className="text-xs text-gray-500 mt-1">{new Date(row.original.createdAt).toLocaleString()}</p>
                                                                            <p className="text-xs text-blue-400 mt-2 font-medium">Your order has been successfully placed.</p>
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                {/* Dynamic steps from trackingHistory */}
                                                                {[...row.original.trackingHistory].reverse().map((step, sIdx) => (
                                                                    <div key={sIdx} className="relative flex gap-6 items-start group/step">
                                                                        <div className={`z-10 w-6 h-6 rounded-full flex items-center justify-center border-4 border-black ${sIdx === 0 ? 'bg-blue-600 animate-pulse' : 'bg-gray-800'}`}>
                                                                            <FontAwesomeIcon icon={faCheckCircle} className={`w-3 h-3 ${sIdx === 0 ? 'text-white' : 'text-gray-500'}`} />
                                                                        </div>
                                                                        <div>
                                                                            <p className={`text-sm font-bold uppercase tracking-wider ${sIdx === 0 ? 'text-blue-400' : 'text-gray-400'}`}>
                                                                                {step.status}
                                                                            </p>
                                                                            <p className="text-xs text-gray-500 mt-1">{new Date(step.timestamp).toLocaleString()}</p>
                                                                            {step.message && (
                                                                                <p className="text-xs text-gray-300 mt-2 p-2 rounded-lg bg-gray-800/40 border border-gray-700/30 italic">
                                                                                    "{step.message}"
                                                                                </p>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="mt-8 p-4 rounded-xl bg-blue-600/5 border border-blue-500/10 flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-full bg-blue-600/10 flex items-center justify-center">
                                                                <FontAwesomeIcon icon={faBox} className="w-5 h-5 text-blue-400" />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-200">Need help with this order?</p>
                                                                <p className="text-xs text-gray-500">Contact our support team for any queries.</p>
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="flex items-center gap-3">
                                                            {/* Cancellation Logic */}
                                                            {['pending', 'placed'].includes(row.original.status) && row.original.request.status === 'none' && (
                                                                <button 
                                                                    onClick={() => openRequestModal(row.original.orderId, 'cancel')}
                                                                    className="px-4 py-2 text-sm font-semibold text-rose-400 border border-rose-500/20 rounded-lg hover:bg-rose-500/10 transition-all flex items-center gap-2"
                                                                >
                                                                    <FontAwesomeIcon icon={faTimesCircle} />
                                                                    Cancel Order
                                                                </button>
                                                            )}

                                                            {/* Return Logic */}
                                                            {row.original.status === 'delivered' && row.original.request.status === 'none' && (
                                                                <button 
                                                                    onClick={() => openRequestModal(row.original.orderId, 'return')}
                                                                    className="px-4 py-2 text-sm font-semibold text-amber-400 border border-amber-500/20 rounded-lg hover:bg-amber-500/10 transition-all flex items-center gap-2"
                                                                >
                                                                    <FontAwesomeIcon icon={faUndo} />
                                                                    Return Items
                                                                </button>
                                                            )}

                                                            {/* Pending Request Indicator */}
                                                            {row.original.request.status === 'pending' && (
                                                                <div className="px-4 py-2 text-sm font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center gap-2">
                                                                    <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
                                                                    {row.original.request.requestType === 'cancel' ? 'Cancellation' : 'Return'} Pending
                                                                </div>
                                                            )}

                                                            <button className="flex items-center gap-2 text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors">
                                                                Contact Support <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4" />
                                                            </button>
                                                        </div>
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
        
        {/* Request Modal */}
        {isRequestModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
                <div className="bg-gray-900 border border-gray-800 w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                    <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center bg-gray-900/50">
                        <h3 className="text-lg font-bold flex items-center gap-2">
                            <FontAwesomeIcon icon={requestType === 'cancel' ? faTimesCircle : faUndo} className={requestType === 'cancel' ? 'text-rose-400' : 'text-amber-400'} />
                            Request {requestType === 'cancel' ? 'Cancellation' : 'Return'}
                        </h3>
                        <button onClick={() => setIsRequestModalOpen(false)} className="text-gray-500 hover:text-white transition-colors">
                            <FontAwesomeIcon icon={faTimes} className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="p-6 space-y-6">
                        <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/50">
                            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Order Details</p>
                            <p className="text-sm font-mono text-gray-200">#{activeOrderId}</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Reason for {requestType}</label>
                            <textarea 
                                value={requestReason}
                                onChange={(e) => setRequestReason(e.target.value)}
                                placeholder={`Why would you like to ${requestType} this order?`}
                                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm min-h-[120px] focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all resize-none placeholder:text-gray-600"
                            />
                        </div>

                        {requestType === 'return' && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Upload Images (Proof)</label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {returnImages.map((img, idx) => (
                                        <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-gray-700 bg-gray-800 group">
                                            <img src={URL.createObjectURL(img)} alt="upload-preview" className="w-full h-full object-cover" />
                                            <button 
                                                onClick={() => setReturnImages(prev => prev.filter((_, i) => i !== idx))}
                                                className="absolute top-1 right-1 w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <FontAwesomeIcon icon={faTimes} className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                    {returnImages.length < 5 && (
                                        <label className="aspect-square rounded-xl border-2 border-dashed border-gray-700 hover:border-blue-500/50 hover:bg-blue-500/5 flex flex-col items-center justify-center cursor-pointer transition-all gap-2 text-gray-500 hover:text-blue-400">
                                            <FontAwesomeIcon icon={faUpload} className="w-5 h-5" />
                                            <span className="text-[10px] font-bold uppercase tracking-wider">Add Image</span>
                                            <input 
                                                type="file" 
                                                className="hidden" 
                                                multiple 
                                                accept="image/*"
                                                onChange={(e) => {
                                                    const files = Array.from(e.target.files);
                                                    setReturnImages(prev => [...prev, ...files].slice(0, 5));
                                                }}
                                            />
                                        </label>
                                    )}
                                </div>
                                <p className="text-[10px] text-gray-500 italic">Upload up to 5 clear images of the product.</p>
                            </div>
                        )}
                    </div>

                    <div className="px-6 py-4 bg-gray-900/50 border-t border-gray-800 flex gap-3">
                        <button 
                            onClick={() => setIsRequestModalOpen(false)}
                            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-800 hover:bg-gray-800 transition-all font-medium text-sm"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleRequestSubmit}
                            disabled={isSubmitting}
                            className={`flex-1 px-4 py-2.5 rounded-xl transition-all font-bold text-sm flex items-center justify-center gap-2 ${
                                requestType === 'cancel' 
                                    ? 'bg-rose-600 hover:bg-rose-700' 
                                    : 'bg-blue-600 hover:bg-blue-700'
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            {isSubmitting ? (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <FontAwesomeIcon icon={requestType === 'cancel' ? faTimesCircle : faCheckCircle} />
                                    Submit Request
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        )}
        </>
    )
}

