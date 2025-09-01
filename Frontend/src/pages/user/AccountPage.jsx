import React from 'react'
import { Navbar } from '../../User/components/Navbar'
import { Footer } from '../../User/components/Footer'
import { Order } from '../../User/features/Account/Order'

export const AccountPage = () => {
    return (
        <>
            <Navbar />
            <Order />
            <Footer />
        </>
    )
}
