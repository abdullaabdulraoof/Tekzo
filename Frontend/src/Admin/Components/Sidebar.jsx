import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

export const Sidebar = () => {
  const token = localStorage.getItem('token');
  const isAdmin = !!token
  const navigate = useNavigate()
  return (
    <header >
      <nav className=' bg-gray-50 text-black fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg h-screen w-[211px] shadow-lg'>
        <div className='flex flex-col h-16 myContainer mx-auto px-4 md:px-10 lg:px-2 py-8 gap-3'>
          <div className="logo hover:cursor-pointer text-sm">
            <h1>{isAdmin ? "Admin Panel" : "Welcome"}</h1>

          </div>

          <ul className='flex flex-col gap-2 text-sm'>

           
            <li className='flex items-center gap-2 hover:cursor-pointer hover:bg-gray-400/15 rounded-lg px-2' onClick={()=>{navigate('/admin')}}>
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
            <li className='flex items-center gap-2 hover:cursor-pointer hover:bg-gray-400/15 rounded-lg px-2' onClick={() => { navigate('/admin/usersList')}}>
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

            <li className='flex items-center gap-2 hover:cursor-pointer hover:bg-gray-400/15 rounded-lg px-2'
              onClick={() => { navigate('/admin/productList')}}>
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

            <li className='flex items-center gap-2 hover:cursor-pointer hover:bg-gray-400/15 rounded-lg px-2'
              onClick={() => { navigate('/admin/orderList')}}>
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

            <li className='flex items-center gap-2 hover:cursor-pointer hover:bg-gray-400/15 rounded-lg px-2'
              onClick={() => { navigate('/admin/addProduct')}}>
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
            {isAdmin && (
              <>
            <li className='flex items-center gap-2 hover:cursor-pointer hover:bg-gray-400/15 rounded-lg px-2'
              onClick={() => {   
                fetch('https://tekzo.onrender.com/admin/logout', {
                    method: 'POST',
                    credentials: 'include'
                  }).then(() => {
                    localStorage.removeItem('token');
                    navigate('/admin/login')
                  })
                }}>
              <div className="flex">
                <lord-icon
                  src="https://cdn.lordicon.com/vfiwitrm.json"
                  trigger="hover"
                  colors="primary:#000 ,secondary:#000"
                  style={{ width: "20px" }}>
                </lord-icon>
              </div>
              <span>Logout</span>
            </li>
              </>
            )}
            {!isAdmin && (
            <li className='flex items-center gap-2 hover:cursor-pointer hover:bg-gray-400/15 rounded-lg px-2'
              onClick={() => { navigate('/admin/login') }}>
              <div className="flex">
                <lord-icon
                    src="https://cdn.lordicon.com/kdduutaw.json"
                    trigger="hover"
                  colors="primary:#000 ,secondary:#000"
                  style={{ width: "20px" }}>
                </lord-icon>
              </div>
              <span>Login</span>
            </li>
            )}

          </ul>
        </div>

      </nav>
    </header>
  )
}
