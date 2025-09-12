import { Routes, Route } from 'react-router-dom'
import { DashboardPage } from '../pages/admin/DashboardPage'
import { LoginPage } from '../pages/admin/LoginPage'
import { OrderList } from '../pages/admin/OrderList'
import { ProductList } from '../pages/admin/ProductList'
import { UsersList } from '../pages/admin/UsersList'
import { Create } from '../pages/admin/Create'
import { Editproduct } from '../pages/admin/Editproduct'
import { ProtectedRoute } from '../components/ProtectedRoute'

function AdminRouter() {
    return (
        <>
            <Routes>
                <Route path='/login' element={<LoginPage />} />

                {/* ✅ Protect admin pages */}
                <Route path='/' element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
                <Route path='/orderList' element={<ProtectedRoute><OrderList /></ProtectedRoute>} />
                <Route path='/productList' element={<ProtectedRoute><ProductList /></ProtectedRoute>} />
                <Route path='/usersList' element={<ProtectedRoute><UsersList /></ProtectedRoute>} />
                <Route path='/addProduct' element={<ProtectedRoute><Create /></ProtectedRoute>} />
                <Route path="/productList/Editproduct/:id" element={<ProtectedRoute><Editproduct /></ProtectedRoute>} />
            </Routes>
        </>
    )
}

export default AdminRouter
