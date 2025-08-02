import React from 'react'

import { Order } from '../../Admin/fetures/Orders/Order'
import { Sidebar } from '../../Admin/Components/Sidebar'

export const OrderList = () => {
    return (
        <>
            <Sidebar />
            <Order />
        </>
    )
}
