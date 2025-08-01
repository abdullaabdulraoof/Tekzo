import React from 'react'
import { Navbar } from '../components/Navbar'
import { Signup } from '../features/auth/Signup'
import { Footer } from '../components/Footer'
export const SigupPage = () => {
    return (
        <>
            <Navbar />
            <Signup />
            <Footer />
        </>

    )
}
