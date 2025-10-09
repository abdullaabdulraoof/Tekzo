import React from 'react'
import { Sidebar } from './Sidebar'
import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table'

const data = [
    
    { id: 1, name: 'Abdulla', qty:2 },
    { id: 2, name: 'Ada', qty: 3 },


]
const columns = [
    { accessorKey: 'orderId', header: 'OrderId' },
    { accessorKey: 'qty', header: 'Qty' }
]



export const Order = () => {
    const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() })
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
                    <div className='flex justify-center items-center bg-black border border-gray-700/70 rounded-xl shadow-2xl h-[75%] w-full'>

                        <table className='border border-gray-700/70'>
                            <thead>
                                {table.getHeaderGroups().map((hg) => (
                                    <tr key={hg.id}>
                                        {hg.headers.map((header) => (
                                            <th key={header.id}>
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                            </th>
                                        ))}
                                    </tr>
                                ))}
                            </thead>
                            <tbody>
                                {table.getRowModel().rows.map((row) => (
                                    <tr key={row.id}>
                                        {row.getVisibleCells().map((cell) => (
                                            <td key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>


                    </div>
                </div>

            </div>
        </section>
    )
}

