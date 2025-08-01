import './App.css'
import { Home } from './pages/Home'
import { Routes,Route } from 'react-router-dom'
import { Products } from './pages/Products'
import { LoginPage } from './pages/LoginPage'
import { SigupPage } from './pages/SigupPage'
import { CartPage } from './pages/CartPage'
import { CheckoutPage } from './pages/CheckoutPage'

function App() {


  return (
    <>
    <Routes>
        <Route path='/' element={<Home />}/>    
        <Route path='/products' element={<Products />} />  
        <Route path='/login' element={<LoginPage />} />  
        <Route path='/signup' element={<SigupPage />} />  
        <Route path='/cart' element={<CartPage />}/>
        <Route path='/checkout' element={<CheckoutPage />} />
    </Routes>
    </>
  )
}

export default App
