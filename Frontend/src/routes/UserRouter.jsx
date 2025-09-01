import { Home } from '../pages/user/Home'
import { Routes, Route } from 'react-router-dom'
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


function UserRouter() {


    return (
        <>
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/products' element={<Products />} />
                <Route path='/login' element={<LoginPage />} />
                <Route path='/signup' element={<SigupPage />} />
                <Route path='/cart' element={<CartPage />} />
                <Route path='/checkout/:id' element={<CheckoutPage />} />
                <Route path="/products/productDetails/:id" element={<ProductView />} />
                <Route path="/orders/:id" element={<OrderSuccessPage />} />
                <Route path="/ordersList" element={<AccountPage />} />
                <Route path="/account/wishlist" element={<WishlistPage />} />
                <Route path="/account/accountdetails" element={<AccounrDetailsPage/>}/>
            </Routes>
        </>
    )
}

export default UserRouter
