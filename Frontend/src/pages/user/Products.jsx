import React from 'react'
import { Navbar } from '../../User/components/Navbar'
import { Footer } from '../../User/components/Footer'
import { ProductList } from '../../User/features/products/ProductList'
export const Products = () => {
  return (
    <>
    <Navbar/>
    <ProductList/>
    <Footer/>
    </>
  )
}
