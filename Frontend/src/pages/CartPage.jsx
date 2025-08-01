import React from 'react'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { Cart } from '../features/cart/Cart'

export const CartPage = () => {
  return (
    <>
    <Navbar/>
    <Cart/>
    <Footer/>
    
    </>
  )
}
