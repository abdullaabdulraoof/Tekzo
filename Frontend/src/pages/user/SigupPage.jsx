import React from 'react'
import { Signup } from '../../User/features/auth/Signup'
import { Navbar } from '../../User/components/Navbar'
import { Footer } from '../../User/components/Footer'
export const SigupPage = () => {
    return (
        <>
            <Navbar />
            <Signup />
            <Footer />
        </>

    )
}
