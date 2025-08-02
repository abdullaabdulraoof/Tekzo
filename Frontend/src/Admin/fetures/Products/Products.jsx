import React,{useRef,useEffect}from 'react'
import DataTable from 'datatables.net-dt';
import 'datatables.net-responsive-dt';
import './Products.css'
export const Products = () => {
    const tableRef = useRef(null);
    useEffect(() => {
        const table = new DataTable(tableRef.current, {
            responsive: true,
        });
        return () => {
            table.destroy(); // cleanup on unmount
        };
    }, []);

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


                        <table ref={tableRef}
                            id="myTable"
                            className="table mt-5 text-xs w-full">
                            <thead>
                                <tr className='border-b border-gray-500/40' >
                                    <th scope="col" className=' text-xs py-4 text-gray-400'>Name</th>
                                    <th scope="col" className=' text-xs py-4 text-gray-400'> Category	 </th>
                                    <th scope="col" className='text-xs py-4 text-gray-400'>Price</th>
                                    <th scope="col" className=' text-xs py-4 text-gray-400'>Stock</th>
                                    <th scope="col" className=' text-xs py-4 text-gray-400'>Status</th>
                                    <th scope="col" className=' text-xs py-4 text-gray-400'>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className='border-b border-gray-500/40'>
                                    <td scope="row" className='text-center text-xs'>
                                        <span>Wireless Headphones</span>
                                    </td>
                                    <td className='text-center text-xs py-4 '>
                                        <span>Electronics</span>
                                    </td>
                                    <td className='text-center text-xs py-4 '>
                                        <span>$299</span>
                                    </td>
                                    <td className='text-center text-xs py-4 '>
                                        <span>45</span>
                                    </td >
                                    <td className='text-center text-xs py-4 '>
                                        <span>$299</span>
                                    </td>

                                    <td className='flex justify-center items-center text-xs py-4 text-gray-400'>
                                        <div className='flex justify-center items-center w-fit bg-white outline outline-gray-800 outline-2 py-1 px-2 rounded-xl text-xs gap-3'>
                                            <span className='text-black font-bold'>Active</span>
                                        </div>
                                    </td>
                                </tr>


                                <tr className='border-b border-gray-500/40'>
                                    <td scope="row" className='text-center text-xs'>
                                        <span>#1234</span>
                                    </td>
                                    <td className='text-center text-xs py-4 '>
                                        <span>John Doe</span>
                                    </td>
                                    <td className='text-center text-xs py-4 '>
                                        <span>2024-01-15</span>
                                    </td>
                                    <td className='text-center text-xs py-4 '>
                                        <span>2</span>
                                    </td >
                                    <td className='text-center text-xs py-4 '>
                                        <span>$299</span>
                                    </td>

                                    <td className='flex justify-center items-center text-xs py-4 text-gray-400'>
                                        <div className='flex justify-center items-center w-fit bg-white outline outline-gray-800 outline-2 py-1 px-2 rounded-xl text-xs gap-3'>
                                            <span className='text-black font-bold'>Completed</span>
                                        </div>
                                    </td>
                                </tr>

                            </tbody>
                        </table>



                    </div>

                </div>
            </div>
        </section>
    )
}
