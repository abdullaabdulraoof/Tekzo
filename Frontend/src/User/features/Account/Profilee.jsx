import React from 'react'
import { Address } from './Address'
import { AccountDetails } from './AccountDetails'


export const Profilee = () => {
    return (
        <section className='min-h-screen bg-black text-white'>
            <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-36 pt-24 pb-16'>


                <div className='flex flex-col justify-between items-center gap-8 w-full '>
                    <div>

                        <h2 className='text-2xl sm:text-6xl font-bold'>Account</h2>
                    </div>
                    <Sidebar />
                </div>
                <div className='w-full h-screen mt-10'>

                    <Address />
                    <AccountDetails />
                </div>

            </div>
        </section>


    )
}
