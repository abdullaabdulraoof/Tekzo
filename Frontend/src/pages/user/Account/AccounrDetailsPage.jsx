import React from 'react'
import { Navbar } from '../../../User/components/Navbar'
import { Footer } from '../../../User/components/Footer'
import { AccountDetails } from '../../../User/features/Account/AccountDetails'
export const AccounrDetailsPage = () => {
    return (
        <>
            <Navbar />
            <AccountDetails />
            <Footer />
        </>
    )
}
