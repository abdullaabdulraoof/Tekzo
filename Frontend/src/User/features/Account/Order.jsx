import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import './Order.css';
import { Sidebar } from './Sidebar';


import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';



function Row({ row }) {
    const [open, setOpen] = React.useState(false);

    return (
        <React.Fragment>
            {/* Order Summary */}
            <TableRow className='!border-gray-700/70'>
                <TableCell className='!border-gray-700/70'>
                    <IconButton onClick={() => setOpen(!open)} size="small" className='!text-white'>
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell className='!text-white !text-xs !text-center !border-gray-700/70'>{row._id}</TableCell>
                <TableCell className='!text-white !text-xs !text-center !border-gray-700/70'  align="right">{new Date(row.createdAt).toLocaleDateString()}</TableCell>
                <TableCell className='!text-white !text-xs !text-center !border-gray-700/70'  align="right">₹{row.totalAmount}</TableCell>
                <TableCell className='!text-white !text-xs !text-center !border-gray-700/70'  align="right">{row.status}</TableCell>
                <TableCell className='!text-white !text-xs !text-center !border-gray-700/70'  align="right">{row.paymentMethod}</TableCell>
            </TableRow>

            {/* Collapsible Products */}
            <TableRow className='!border-gray-700/70'>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6} className='!border-gray-700/70'>
                    <Collapse in={open} timeout="auto" unmountOnExit >
                        <Box sx={{ margin: 1 }}>
                           
                            <Table size="small">
                                <TableHead className='!text-white !text-xs !font-bold'>
                                    <TableRow>
                                        <TableCell className='!text-white !text-xs !font-bold !text-center' sx={{ borderBottom: "none" }} >Item</TableCell>
                                        <TableCell className='!text-white !text-xs !font-bold !text-center' sx={{ borderBottom: "none" }} >Image</TableCell>
                                        <TableCell className='!text-white !text-xs !font-bold !text-center' align="right" sx={{ borderBottom: "none" }} >Quantity</TableCell>
                                        <TableCell className='!text-white !text-xs !font-bold !text-center' align="right" sx={{ borderBottom: "none" }} >Price</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {row.products.map((p, i) => (
                                        <TableRow key={i}>
                                            <TableCell className='!text-white !text-xs !text-center' sx={{ borderBottom: "none" }} >{p.product.name}</TableCell>
                                            <TableCell className="!text-center" sx={{ borderBottom: "none" }} >
                                                <div className="flex justify-center items-center ">
                                                    <img
                                                        src={p.product.images[0]}
                                                        alt={p.product.name}
                                                        className="w-[60px] h-[60px] rounded-lg object-cover"
                                                    />
                                                </div>
                                            </TableCell>

                                            <TableCell className='!text-white !text-xs !text-center' align="right" sx={{ borderBottom: "none" }} >{p.quantity}</TableCell>
                                            <TableCell className='!text-white !text-xs !text-center' align="right" sx={{ borderBottom: "none" }} >₹{p.product.price}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}


Row.propTypes = {
    row: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        createdAt: PropTypes.string.isRequired,
        totalAmount: PropTypes.number.isRequired,
        status: PropTypes.string.isRequired,
        paymentMethod: PropTypes.string.isRequired,
        products: PropTypes.arrayOf(
            PropTypes.shape({
                product: PropTypes.shape({
                    name: PropTypes.string.isRequired,
                    price: PropTypes.number.isRequired,
                    image: PropTypes.string.isRequired,
                }).isRequired,
                quantity: PropTypes.number.isRequired,
            })
        ).isRequired,
    }).isRequired,
};




export const Order = () => {
    const token = localStorage.getItem("userToken")
    const navigate = useNavigate()
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        if (!token) {
            console.error("No token found! Please login.");
            navigate("/login");
        }
    }, [token, navigate]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await axios.get('https://tekzo.onrender.com/api/ordersList', { headers: { Authorization: `Bearer ${token}` }, withCredentials: true });

                console.log("Fetched users:", res.data.orders);
                setOrders(res.data.orders || []);
            } catch (err) {
                console.error('Error fetching users:', err);
            }
        };
        fetchOrders();
    }, [token]);





    return (
        <section className='h-fit bg-black text-white'>
            <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-36 pt-24'>

                <div className='flex flex-col justify-between items-center pb-4 w-full lg:flex-row'>
                    <div>

                        <h2 className='text-2xl sm:text-3xl font-bold'>My Account</h2>
                    </div>
                    <Sidebar />
                </div>


                <div className='flex flex-col lg:flex-row gap-6 justify-between items-start w-full h-screen '>
                    



                    <div className="flex-1 bg-black border border-gray-700/70 rounded-xl shadow-2xl !h-[75%] p-4 flex flex-col gap-4">
                        <TableContainer component={Paper} className="!text-white bg-black !text-xs !overflow-x-hidden">
                            <Table aria-label="collapsible table" className='!text-white bg-black !text-xs'>
                                <TableHead>
                                    <TableRow>
                                        <TableCell className='!text-white !text-xs !font-bold !border-gray-700/70' />
                                        <TableCell className='!text-white !text-xs !font-bold !text-center !border-gray-700/70' >Order ID</TableCell>
                                        <TableCell className='!text-white !text-xs !font-bold !text-center !border-gray-700/70'  align="right">Date</TableCell>
                                        <TableCell className='!text-white !text-xs !font-bold !text-center !border-gray-700/70'  align="right">Total</TableCell>
                                        <TableCell className='!text-white !text-xs !font-bold !text-center !border-gray-700/70'  align="right">Status</TableCell>
                                        <TableCell className='!text-white !text-xs !font-bold !text-center !border-gray-700/70'  align="right">payment</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody className='!text-white'>
                                    {orders.map((row) => (
                                        <Row key={row.name} row={row} />
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                    


                    </div>
                </div>

            </div>
        </section>
    )
}
