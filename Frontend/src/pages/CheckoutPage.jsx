import React from 'react'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { Checkout } from '../features/Checkout/Checkout'

export const CheckoutPage = () => {
  return (
    <>
    <Navbar/>
    <Checkout/>
    <Footer/>
    </>
  )
}
