import React from 'react'
import { Navbar } from '../components/Navbar'
import { Banner } from '../components/Banner'
import { ProductCard } from '../components/productCard'
import { Footer } from '../components/Footer'
export const Home = () => {
  return (
    <>
    <Navbar />
    <Banner />
    <ProductCard />
    <Footer/>
    </>
  )
}
