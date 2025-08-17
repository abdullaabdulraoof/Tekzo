import React from 'react'
import { Navbar } from '../../User/components/Navbar'
import { Footer } from '../../User/components/Footer'
import { Checkout } from '../../User/features/Checkout/Checkout'

export const CheckoutPage = () => {
  return (
    <>
    <Navbar/>
    <Checkout/>
    <Footer/>
    </>
  )
}
