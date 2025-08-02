import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
export const Sidebar = () => {
  return (
    <header >
      <nav className=' bg-[hsl(0,0%,98%)] text-black w-[15vw] fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg h-full'>
        <div className='flex flex-col h-16 myContainer mx-auto px-4 md:px-10 lg:px-2 py-8 gap-3'>
          <div className="logo hover:cursor-pointer text-sm">
            <h1>Admin</h1>
          </div>

          <ul className='flex flex-col gap-2 text-sm'>
            <li className='flex items-center gap-2 hover:cursor-pointer hover:bg-gray-400/15 rounded-lg px-2'>
              <div className="flex">
                <lord-icon
                  src="https://cdn.lordicon.com/dutqakce.json"
                  trigger="hover"
                  colors="primary:#000"
                  style={{ width: "20px" }}>
                </lord-icon>
              </div>
              <span>Dashboard</span>
            </li>

            <li className='flex items-center gap-2 hover:cursor-pointer hover:bg-gray-400/15 rounded-lg px-2'>
              <div className="flex">
                <lord-icon
                  src="https://cdn.lordicon.com/kdduutaw.json"
                  trigger="hover"
                  colors="primary:#000 ,secondary:#000"
                  style={{ width: "20px" }}>
                </lord-icon>
              </div>
              <span>All Users</span>
            </li>

            <li className='flex items-center gap-2 hover:cursor-pointer hover:bg-gray-400/15 rounded-lg px-2'>
              <div className="flex">
                <lord-icon
                  src="https://cdn.lordicon.com/rezibkiy.json"
                  trigger="hover"
                  colors="primary:#000 ,secondary:#000"
                  style={{ width: "20px" }}>
                </lord-icon>
              </div>
              <span>All Products</span>
            </li>

            <li className='flex items-center gap-2 hover:cursor-pointer hover:bg-gray-400/15 rounded-lg px-2'>
              <div className="flex">
                <lord-icon
                  src="https://cdn.lordicon.com/ggirntso.json"
                  trigger="hover"
                  colors="primary:#000 ,secondary:#000"
                  style={{ width: "20px" }}>
                </lord-icon>
              </div>
              <span>All Orders</span>
            </li>

            <li className='flex items-center gap-2 hover:cursor-pointer hover:bg-gray-400/15 rounded-lg px-2'>
              <div className="flex">
                <lord-icon
                  src="https://cdn.lordicon.com/sbnjyzil.json"
                  trigger="hover"
                  colors="primary:#000 ,secondary:#000"
                  style={{ width: "20px" }}>
                </lord-icon>
              </div>
              <span>Add Product</span>
            </li>


          </ul>
        </div>

      </nav>
    </header>
  )
}
