import React, { useEffect, useState } from 'react'
import { Sidebar } from './Sidebar'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    getPaginationRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    getExpandedRowModel
} from '@tanstack/react-table'

const columns = [
    {
        id: 'expander',
        header: ' ',
        cell: ({ row }) => (

            <button
                onClick={row.getToggleExpandedHandler()}
                className="text-lg font-bold text-blue-400 hover:text-blue-300 transition-all duration-300"
            >
                {row.getIsExpanded() ? '−' : '+'}
            </button>
        ),
    },
    { accessorKey: 'orderId', header: 'Order ID' },
    { accessorKey: 'status', header: 'Status' },
    { accessorKey: 'paymentMethod', header: 'PaymentMethod' },
    { accessorKey: 'total', header: 'Total (₹)' },

];


export const Order = () => {
    const token = localStorage.getItem("userToken")
    const navigate = useNavigate()
    const [order, setorder] = useState([])
    const [sorting, setSorting] = useState([])
    const [filtering, setFiltering] = useState('')
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

    useEffect(() => {
        const fetchOrder = async () => {
            const res = await axios.get("https://tekzo.onrender.com/api/ordersList", { headers: { Authorization: `Bearer ${token}` }, withCredentials: true })

            const fetchedorder = res.data.orders.map((order)=>({
                orderId:order._id,
                status: order.status,
                paymentMethod: order.paymentMethod,
                total: order.totalAmount,
                items:order.products.map((p)=>({
                    image:p.product.images[0],
                    name: p.product.name,
                    qty: p.qty,
                    price: p.product.price
                }))
            }))
            setorder(fetchedorder)
            console.log(fetchedorder);
            

        }
        fetchOrder()
    }, [token])

    const table = useReactTable({
        data : order,
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

    return (
        <section className='min-h-screen bg-black text-white'>
            <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-36 pt-24 pb-16'>

                <div className='flex flex-col justify-between items-center pb-4 w-full lg:flex-row gap-2'>
                    <div>

                        <h2 className='text-2xl sm:text-3xl font-bold'>My Account</h2>
                    </div>
                    <Sidebar />
                </div>

                <div className='w-full h-screen'>
                    <div className="flex flex-col justify-center bg-black border border-gray-700/70 rounded-xl shadow-2xl h-[80%] w-full p-4 ">


                        <div className="flex justify-end mb-4">
                            <input
                                type="text"
                                value={filtering}
                                onChange={(e) => setFiltering(e.target.value)}
                                placeholder="Search..."
                                className="p-2 bg-black border border-gray-700/70 rounded-lg focus:outline-none"
                            />
                        </div>

                        <div className="h-[400px] overflow-y-auto">
                            <table className="mx-auto border border-gray-700/70 rounded-lg w-full h-50% overflow-hidden">
                                <thead className="border-b border-gray-700/70">
                                    {table.getHeaderGroups().map((hg) => (
                                        <tr key={hg.id}>
                                            {hg.headers.map((header) => (
                                                <th
                                                    key={header.id}
                                                    onClick={header.column.getToggleSortingHandler()}
                                                    className="px-6 py-4 cursor-pointer text-center"
                                                >
                                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                                    {{
                                                        asc: ' ⬆️',
                                                        desc: ' ⬇️',
                                                    }[header.column.getIsSorted()] ?? null}
                                                </th>
                                            ))}
                                        </tr>
                                    ))}
                                </thead>

                                <tbody>
                                    {table.getRowModel().rows.map((row) => (
                                        <React.Fragment key={row.id}>

                                            <tr className="hover:bg-gray-800/50 transition-all duration-700">
                                                {row.getVisibleCells().map((cell) => (
                                                    <td className="px-6 py-3 text-center" key={cell.id}>
                                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                    </td>
                                                ))}
                                            </tr>


                                            {row.getIsExpanded() && (
                                                <tr>
                                                    <td colSpan={columns.length} className="bg-gray-900/60 text-gray-300 px-6 py-4 text-left rounded-b-lg transition-all duration-300">
                                                        <div className="space-y-4">
                                                            <h4 className="font-semibold text-lg mb-2">Order Details</h4>
                                                            <div className="overflow-x-auto">
                                                                <table className="w-full text-sm border border-gray-700/50 rounded-lg transition-all duration-300">
                                                                    <thead>
                                                                        <tr className="bg-gray-800/70">
                                                                            <th className="px-4 py-2 text-left">Image</th>
                                                                            <th className="px-4 py-2 text-left">Name</th>
                                                                            <th className="px-4 py-2 text-left">Qty</th>
                                                                            <th className="px-4 py-2 text-left">Price (₹)</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {row.original.items?.map((item, idx) => (
                                                                            <tr key={idx} className="hover:bg-gray-800/30 ">
                                                                                <td className="px-4 py-2"><img src={item.image} alt="" className='w-[100px]' /></td>
                                                                                <td className="px-4 py-2">{item.name}</td>
                                                                                <td className="px-4 py-2">{item.qty}</td>
                                                                                <td className="px-4 py-2">{item.price}</td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>
                        </div>


                        <div className="flex justify-center items-center my-4 space-x-4">
                            <button
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                                className="px-3 py-1 border border-gray-700/70 rounded-md disabled:opacity-40"
                            >
                                Previous
                            </button>

                            <span>
                                Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                            </span>

                            <button
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                                className="px-3 py-1 border border-gray-700/70 rounded-md disabled:opacity-40"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    )
}

