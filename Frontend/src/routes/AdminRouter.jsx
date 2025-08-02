import { Routes, Route } from 'react-router-dom'
import { DashboardPage } from '../pages/admin/DashboardPage'
import { LoginPage } from '../pages/admin/LoginPage'
import { OrderList } from '../pages/admin/OrderList'
import { ProductList } from '../pages/admin/ProductList'
import { UsersList } from '../pages/admin/UsersList'



function AdminRouter() {


    return (
        <>
            <Routes>
                <Route path='/' element={<DashboardPage />} />
                <Route path='/login' element={<LoginPage />} />
                <Route path='/orderList' element={<OrderList />} />
                <Route path='/productList' element={<ProductList />} />
                <Route path='/usersList' element={<UsersList />} />
            </Routes>
        </>
    )
}

export default AdminRouter
