import React from 'react'
import { ProductDetail } from '../../User/features/products/ProductDetail'
import { Navbar } from '../../components/Navbar'
import { Footer } from '../../components/Footer'
export const ProductView = () => {
    return (
        <>
            <Navbar />
            <ProductDetail />
            <Footer />
        </>
    )
}
