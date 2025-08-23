import React from 'react'
import { Navbar } from '../../User/components/Navbar'
import { Footer } from '../../User/components/Footer'
import { OrderSuccess } from '../../User/features/Order Success/OrderSuccess'

export const OrderSuccessPage = () => {
  return (
    <>
    <Navbar/>
    <OrderSuccess/>
    <Footer />
    </>
  )
}
