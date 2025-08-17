import React from 'react'
import { ProductDetail } from '../../User/features/products/ProductDetail'
import { Navbar } from '../../User/components/Navbar'
import { Footer } from '../../User/components/Footer'
export const ProductView = () => {
    return (
        <>
            <Navbar />
            <ProductDetail />
            <Footer />
        </>
    )
}
