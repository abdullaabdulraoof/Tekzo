import React from 'react'
import { Navbar } from '../../User/components/Navbar'
import { Banner } from '../../User/components/Banner'
import { ProductCard } from '../../User/components/ProductCard'
import { Footer } from '../../User/components/Footer'
import { PostCard } from '../../User/components/PostCard'
export const Home = () => {
  return (
    <>
    <Navbar />
    <Banner />
      <PostCard />
      <ProductCard />
    
    
    <Footer/>
    </>
  )
}
