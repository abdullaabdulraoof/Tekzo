// Dashboard.js
import React from 'react';

export const Dashboard = () => {
  return (
    <section className="min-h-screen bg-black text-white ml-[211px]">
      <div className="flex flex-col gap-6 mx-auto px-4 sm:px-6 lg:px-10 py-8 pb-16">
        <div>

        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className='text-xs text-gray-400'>Welcome to your admin dashboard</p>
        </div>
      
        <div className='flex gap-3 py-4 px-2 rounded-lg'>
          <div className='w-[280px] h-[100px] border border-gray-400/25 rounded-lg p-2 px-4'>
            <div className='flex justify-between items-center font-bold'>
              <span className='text-xs'>Total Users</span>
              <div className="flex">
                <lord-icon
                  src="https://cdn.lordicon.com/kdduutaw.json"
                  trigger="hover"
                  colors="primary:#ffffff ,secondary:#ffffff "
                  style={{ width: "18px" }}>
                </lord-icon>
              </div>
            </div>
            <div className='flex flex-col'>
              <span className='text-lg font-bold'>1,234</span>

              <span className='text-xs'> <span className='text-green-500'>+12%</span> from last month</span>
            </div>
        </div>

          <div className='w-[280px] h-[100px] border border-gray-400/25 rounded-lg p-2 px-4'>
            <div className='flex justify-between items-center font-bold'>
              <span className='text-xs'>Products</span>
              <div className="flex">
                <lord-icon
                  src="https://cdn.lordicon.com/rezibkiy.json"
                  trigger="hover"
                  colors="primary:#ffffff ,secondary:#ffffff "
                  style={{ width: "18px" }}>
                </lord-icon>
              </div>
            </div>
            <div className='flex flex-col'>
              <span className='text-lg font-bold'>1,234</span>

              <span className='text-xs'> <span className='text-green-500'>+12%</span> from last month</span>
            </div>
          </div>

          <div className='w-[280px] h-[100px] border border-gray-400/25 rounded-lg p-2 px-4'>
            <div className='flex justify-between items-center font-bold'>
              <span className='text-xs'>Orders</span>
              <div className="flex">
                <lord-icon
                  src="https://cdn.lordicon.com/ggirntso.json"
                  trigger="hover"
                  colors="primary:#ffffff ,secondary:#ffffff "
                  style={{ width: "18px" }}>
                </lord-icon>
              </div>
            </div>
            <div className='flex flex-col'>
              <span className='text-lg font-bold'>1,234</span>

              <span className='text-xs'> <span className='text-green-500'>+12%</span> from last month</span>
            </div>
          </div>

          <div className='w-[280px] h-[100px] border border-gray-400/25 rounded-lg p-2 px-4'>
            <div className='flex justify-between items-center font-bold'>
              <span className='text-xs'>Revenue</span>
              <div className="flex">
                <lord-icon
                  src="https://cdn.lordicon.com/dnupukmh.json"
                  trigger="hover"
                  colors="primary:#ffffff ,secondary:#ffffff "
                  style={{ width: "18px" }}>
                </lord-icon>
              </div>
            </div>
            <div className='flex flex-col'>
              <span className='text-lg font-bold'>1,234</span>

              <span className='text-xs'> <span className='text-green-500'>+12%</span> from last month</span>
            </div>
          </div>
      </div>

        <div className='flex flex-col gap-3 py-4 px-4 border border-gray-400/25 rounded-lg'>
          <h1 className="text-xl font-bold">Recent Orders</h1>
          <div className='flex flex-col gap-3'>


            <div className='w-full border border-gray-400/25 rounded-lg p-2 px-4'>
              <div className='flex justify-between items-center'>
                <div className='flex flex-col'>
                  <span className='text-xs font-bold'>#1234</span>
                  <span className='text-xs text-gray-400'>John Doe</span>
                </div>
                <div className='flex flex-col'>
                  <span className='text-xs font-bold'>Wireless Headphones</span>
                  <span className='text-xs text-gray-400'>$299</span>
                </div>
                <div className='flex justify-center items-center w-fit bg-white outline outline-gray-800 outline-2 py-1 px-2 rounded-xl text-xs gap-3'>
                  <span className='text-black font-bold'>Completed</span>
                </div>
              </div>
            </div>


            <div className='w-full border border-gray-400/25 rounded-lg p-2 px-4'>
              <div className='flex justify-between items-center'>
                <div className='flex flex-col'>
                  <span className='text-xs font-bold'>#1234</span>
                  <span className='text-xs text-gray-400'>John Doe</span>
                </div>
                <div className='flex flex-col'>
                  <span className='text-xs font-bold'>Wireless Headphones</span>
                  <span className='text-xs text-gray-400'>$299</span>
                </div>
                <div className='flex justify-center items-center w-fit bg-white outline outline-gray-800 outline-2 py-1 px-2 rounded-xl text-xs gap-3'>
                  <span className='text-black font-bold'>Completed</span>
                </div>
              </div>
            </div>



            
          </div>
         
        </div>
      </div>
    </section>
  );
};
