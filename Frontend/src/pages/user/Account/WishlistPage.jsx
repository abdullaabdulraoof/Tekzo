import React from 'react'
import { Navbar } from '../../../User/components/Navbar'
import { Footer } from '../../../User/components/Footer'
import { Wishlist } from '../../../User/features/Account/Wishlist'

export const WishlistPage = () => {
    return (
        <>
            <Navbar />
            <Wishlist />
            <Footer />
        </>
    )
}
