import React from 'react'
import { Profilee } from '../../../User/features/Account/Profilee'
import { Navbar } from '../../../User/components/Navbar'
import { Footer } from '../../../User/components/Footer'

export const ProfileePage = () => {
    return (
        <>
            <Navbar />
            <Profilee />
            <Footer />
        </>
    )
}
