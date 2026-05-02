import React, { useRef, useEffect, useState } from 'react';
import './Order.css';
import axios from 'axios';
import { API_URL } from '../../../config/apiConfig';
import $ from 'jquery';
import DataTable from 'datatables.net-dt';
import 'datatables.net-responsive-dt';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTimes, faCheckCircle, faExclamationTriangle, faUndo, faTimesCircle, faBan, faImage } from '@fortawesome/free-solid-svg-icons';
import { toast, ToastContainer } from 'react-toastify';

export const Order = () => {
    const token = localStorage.getItem("token");
    const tableRef = useRef(null);
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();
    
    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [newStatus, setNewStatus] = useState('');
    const [statusMessage, setStatusMessage] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        if (!token) {
            console.error("No token found! Please login.");
            navigate("/admin/login");
        }
    }, [token, navigate]);

    const fetchOrders = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/admin/ordersList`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOrders(res.data.orders || []);
        } catch (err) {
            console.error('Error fetching orders:', err);
            toast.error("Failed to load orders");
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [token]);

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

    const openUpdateModal = (order) => {
        setSelectedOrder(order);
        setNewStatus(order.status);
        setStatusMessage('');
        setIsModalOpen(true);
    };

    const handleUpdateStatus = async () => {
        if (!selectedOrder) return;
        setIsUpdating(true);
        try {
            await axios.put(
                `${API_URL}/api/admin/orders/${selectedOrder._id}/status`,
                { status: newStatus, message: statusMessage },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success("Order status updated successfully!");
            setIsModalOpen(false);
            fetchOrders(); // Refresh the list
        } catch (err) {
            console.error("Update failed:", err);
            toast.error(err.response?.data?.message || "Failed to update status");
        } finally {
            setIsUpdating(false);
        }
    };

    const handleRequestDecision = async (action) => {
        if (!selectedOrder) return;
        setIsUpdating(true);
        try {
            await axios.put(
                `${API_URL}/api/admin/orders/${selectedOrder._id}/request-handle`,
                { action, adminMessage: statusMessage },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success(`Request ${action}ed successfully!`);
            setIsModalOpen(false);
            fetchOrders();
        } catch (err) {
            toast.error(err.response?.data?.message || `Failed to ${action} request`);
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <section className="min-h-screen bg-black text-white ml-[211px]">
            <ToastContainer theme="dark" />
            <div className="flex flex-col gap-6 mx-auto px-4 sm:px-6 lg:px-10 py-8 pb-16">
                <div>
                    <h1 className="text-2xl font-bold">All Orders</h1>
                    <p className='text-xs text-gray-400'>Manage and track customer orders</p>
                </div>
                <div className='flex flex-col gap-3 py-4 px-4 border border-gray-400/25 rounded-lg'>
                    <h1 className="text-xl font-bold text-blue-400">Orders</h1>
                    <div className='flex flex-col gap-3'>
                        <table ref={tableRef} id="myTable" className="table mt-5 text-xs w-full">
                            <thead>
                                <tr className='border-b border-gray-500/40'>
                                    <th className='text-xs py-4 text-gray-400'>Order ID</th>
                                    <th className='text-xs py-4 text-gray-400'>Customer</th>
                                    <th className='text-xs py-4 text-gray-400'>Date</th>
                                    <th className='text-xs py-4 text-gray-400'>Total</th>
                                    <th className='text-xs py-4 text-gray-400'>Status</th>
                                    <th className='text-xs py-4 text-gray-400'>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((o) => (
                                    <tr id={`row-${o._id}`} key={o._id} className='border-b border-gray-500/40'>
                                        <td className='text-center text-xs py-4 font-mono'>#{o._id.slice(-8).toUpperCase()}</td>
                                        <td className='text-center text-xs py-4'>{o.user?.name || o.user?.email || 'N/A'}</td>
                                        <td className='text-center text-xs py-4'>{new Date(o.createdAt).toLocaleDateString()}</td>
                                        <td className='text-center text-xs py-4 font-bold text-emerald-400'>₹{o.totalAmount.toLocaleString()}</td>
                                        <td className='text-center text-xs py-4'>
                                            <span className={`px-2 py-0.5 rounded-full border ${
                                                o.status === 'delivered' ? 'border-emerald-500/50 text-emerald-400 bg-emerald-500/5' :
                                                o.status === 'pending' ? 'border-amber-500/50 text-amber-400 bg-amber-500/5' :
                                                'border-blue-500/50 text-blue-400 bg-blue-500/5'
                                            }`}>
                                                {o.status}
                                            </span>
                                        </td>
                                        <td className='text-center text-xs py-4'>
                                            <button 
                                                onClick={() => openUpdateModal(o)}
                                                className={`px-3 py-1.5 border rounded-lg transition-all flex items-center gap-2 mx-auto ${
                                                    o.request?.status === 'pending' 
                                                    ? 'bg-amber-600/10 text-amber-400 border-amber-500/20 hover:bg-amber-600/20' 
                                                    : 'bg-blue-600/10 text-blue-400 border-blue-500/20 hover:bg-blue-600/20'
                                                }`}
                                            >
                                                {o.request?.status === 'pending' ? (
                                                    <>
                                                        <FontAwesomeIcon icon={faExclamationTriangle} className="w-3 h-3 animate-pulse" />
                                                        Review Request
                                                    </>
                                                ) : (
                                                    <>
                                                        <FontAwesomeIcon icon={faEdit} className="w-3 h-3" />
                                                        Update
                                                    </>
                                                )}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Status Update & Request Review Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-gray-900 border border-gray-800 w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                        <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center bg-gray-900/50">
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                <FontAwesomeIcon icon={faEdit} className="text-blue-400" />
                                Update Order Status
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white transition-colors">
                                <FontAwesomeIcon icon={faTimes} className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-blue-600/5 border border-blue-500/10 p-3 rounded-xl">
                                    <p className="text-[10px] text-gray-500 uppercase font-bold">Order ID</p>
                                    <p className="text-sm font-mono text-gray-200">#{selectedOrder?._id.slice(-8).toUpperCase()}</p>
                                </div>
                                <div className="bg-blue-600/5 border border-blue-500/10 p-3 rounded-xl">
                                    <p className="text-[10px] text-gray-500 uppercase font-bold">Current Status</p>
                                    <p className="text-sm font-bold text-blue-400 uppercase tracking-wider">{selectedOrder?.status}</p>
                                </div>
                            </div>

                            {/* User Request Section */}
                            {selectedOrder?.request?.status === 'pending' && (
                                <div className="bg-amber-600/5 border border-amber-500/20 p-5 rounded-2xl space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-amber-400 font-bold flex items-center gap-2">
                                            <FontAwesomeIcon icon={faExclamationTriangle} />
                                            PENDING {selectedOrder.request.requestType.toUpperCase()} REQUEST
                                        </h4>
                                        <span className="text-[10px] text-gray-500 font-mono">
                                            Requested: {new Date(selectedOrder.request.requestedAt).toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs text-gray-500 uppercase font-bold">User Reason:</p>
                                        <p className="text-sm text-gray-200 bg-black/40 p-3 rounded-xl border border-gray-800 italic">
                                            "{selectedOrder.request.reason}"
                                        </p>
                                    </div>

                                    {selectedOrder.request.images?.length > 0 && (
                                        <div className="space-y-2">
                                            <p className="text-xs text-gray-500 uppercase font-bold">Return Proof Images:</p>
                                            <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
                                                {selectedOrder.request.images.map((img, idx) => (
                                                    <a key={idx} href={img} target="_blank" rel="noreferrer" className="flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden border border-gray-800 hover:border-amber-500/50 transition-colors">
                                                        <img src={img} alt="proof" className="w-full h-full object-cover" />
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {!selectedOrder?.request || selectedOrder.request.status !== 'pending' ? (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Change Status Manually</label>
                                    <select 
                                        value={newStatus}
                                        onChange={(e) => setNewStatus(e.target.value)}
                                        className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="placed">Placed</option>
                                        <option value="shipped">Shipped</option>
                                        <option value="delivered">Delivered</option>
                                        <option value="cancelled">Cancelled</option>
                                        <option value="returned">Returned</option>
                                    </select>
                                </div>
                            ) : null}

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">
                                    {selectedOrder?.request?.status === 'pending' ? 'Admin Response / Note' : 'Message (Optional)'}
                                </label>
                                <textarea 
                                    value={statusMessage}
                                    onChange={(e) => setStatusMessage(e.target.value)}
                                    placeholder={selectedOrder?.request?.status === 'pending' ? "Tell the user why you are approving/rejecting their request..." : "e.g. Your order has been picked up by the courier"}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm min-h-[100px] focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all resize-none"
                                />
                            </div>
                        </div>

                        <div className="px-6 py-4 bg-gray-900/50 border-t border-gray-800 flex gap-3">
                            {selectedOrder?.request?.status === 'pending' ? (
                                <>
                                    <button 
                                        onClick={() => handleRequestDecision('reject')}
                                        disabled={isUpdating}
                                        className="flex-1 px-4 py-2.5 rounded-xl bg-rose-600/10 hover:bg-rose-600 text-rose-500 hover:text-white border border-rose-500/20 transition-all font-bold flex items-center justify-center gap-2"
                                    >
                                        <FontAwesomeIcon icon={faBan} />
                                        Reject Request
                                    </button>
                                    <button 
                                        onClick={() => handleRequestDecision('approve')}
                                        disabled={isUpdating}
                                        className="flex-1 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-all font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
                                    >
                                        <FontAwesomeIcon icon={faCheckCircle} />
                                        Approve Request
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button 
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-1 px-4 py-2.5 rounded-xl border border-gray-800 hover:bg-gray-800 transition-all font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        onClick={handleUpdateStatus}
                                        disabled={isUpdating}
                                        className="flex-1 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-bold flex items-center justify-center gap-2"
                                    >
                                        {isUpdating ? (
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <FontAwesomeIcon icon={faCheckCircle} />
                                                Update Status
                                            </>
                                        )}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};
