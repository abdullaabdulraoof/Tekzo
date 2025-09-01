import React from 'react'
import { Navbar } from '../../User/components/Navbar'
import { Banner } from '../../User/components/Banner'
import { Banner2 } from '../../User/components/Banner2'
import { Banner3 } from '../../User/components/Banner3'
import { BrandCard } from '../../User/components/BrandCard'
import { Footer } from '../../User/components/Footer'
import { PostCard } from '../../User/components/PostCard'
export const Home = () => {
  return (
    <>
    <Navbar />
    <Banner />
      <BrandCard />
      <Banner2 />
      <PostCard />
      <Banner3 />
    
    
    <Footer/>
    </>
  )
}
