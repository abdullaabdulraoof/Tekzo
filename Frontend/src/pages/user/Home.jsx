import React from 'react'
import { Navbar } from '../../components/Navbar'
import { Banner } from '../../components/Banner'
import { ProductCard } from '../../components/ProductCard'
import { Footer } from '../../components/Footer'
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
