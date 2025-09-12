import { Routes, Route } from 'react-router-dom'
import { Home } from '../pages/user/Home'
import { Products } from '../pages/user/Products'
import { LoginPage } from '../pages/user/LoginPage'
import { SigupPage } from '../pages/user/SigupPage'
import { CartPage } from '../pages/user/CartPage'
import { CheckoutPage } from '../pages/user/CheckoutPage'
import { ProductView } from '../pages/user/ProductView'
import { OrderSuccessPage } from '../pages/user/OrderSuccessPage'
import { AccountPage } from '../pages/user/AccountPage'
import { WishlistPage } from '../pages/user/Account/WishlistPage'
import { AccounrDetailsPage } from '../pages/user/Account/AccounrDetailsPage'
import { AddressPage } from '../pages/user/Account/AddressPage'
import { ProtectedRoute } from '../User/components/ProtectedRoute'

function UserRouter() {
    return (
        <>
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/products' element={<Products />} />
                <Route path='/login' element={<LoginPage />} />
                <Route path='/signup' element={<SigupPage />} />

                {/* ✅ Protected pages */}
                <Route path='/cart' element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
                <Route path='/checkout/:id' element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
                <Route path="/products/productDetails/:id" element={<ProtectedRoute><ProductView /></ProtectedRoute>} />
                <Route path="/orders/:id" element={<ProtectedRoute><OrderSuccessPage /></ProtectedRoute>} />
                <Route path="/ordersList" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
                <Route path="/account/wishlist" element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />
                <Route path="/account/accountdetails" element={<ProtectedRoute><AccounrDetailsPage /></ProtectedRoute>} />
                <Route path="/account/address" element={<ProtectedRoute><AddressPage /></ProtectedRoute>} />
            </Routes>
        </>
    )
}

export default UserRouter
