import { Routes, Route } from 'react-router-dom'
import { DashboardPage } from '../pages/admin/DashboardPage'
import { LoginPage } from '../pages/admin/LoginPage'
import { OrderList } from '../pages/admin/OrderList'
import { ProductList } from '../pages/admin/ProductList'
import { UsersList } from '../pages/admin/UsersList'
import { Create } from '../pages/admin/Create'
import { Editproduct } from '../pages/admin/Editproduct'


function AdminRouter() {


    return (
        <>
            <Routes>
                <Route path='/' element={<DashboardPage />} />
                <Route path='/login' element={<LoginPage />} />
                <Route path='/orderList' element={<OrderList />} />
                <Route path='/productList' element={<ProductList />} />
                <Route path='/usersList' element={<UsersList />} />
                <Route path='/addProduct' element={<Create />} />
                <Route path="/productList/Editproduct/:id" element={<Editproduct />} />

            </Routes>
        </>
    )
}

export default AdminRouter
