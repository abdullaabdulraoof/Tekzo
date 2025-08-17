import React from 'react'
import { Navbar } from '../../User/components/Navbar'
import { Footer } from '../../User/components/Footer'
import { Cart } from '../../User/features/cart/Cart'

export const CartPage = () => {
  return (
    <>
      <Navbar />
      <Cart />
      <Footer />

    </>
  )
}
 