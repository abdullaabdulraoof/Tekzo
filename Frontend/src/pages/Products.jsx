import React from 'react'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { ProductList } from '../features/products/ProductlIst'
export const Products = () => {
  return (
    <>
    <Navbar/>
    <ProductList/>
    <Footer/>
    </>
  )
}
