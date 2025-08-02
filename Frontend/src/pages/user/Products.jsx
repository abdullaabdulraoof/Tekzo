import React from 'react'
import { Navbar } from '../../components/Navbar'
import { Footer } from '../../components/Footer'
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
