import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useParams } from 'react-router-dom'
export const Checkout = () => {
    const token = localStorage.getItem("userToken")
    const navigate = useNavigate()
    const { id } = useParams();
    const [cart, setCart] = useState([])
    const [phone, setPhone] = useState('')
    const [email, setEmail] = useState('')
    const [address, setAddress] = useState('')
    const [pinCode, setPinCode] = useState('')
    const [country, setCountry] = useState('')
    const [paymentMethod, setPaymentMethod] = useState('')
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);

    useEffect(() => {
        if (!token) {
            console.error("No token found! Please login.");
            navigate("/login");
        }
    }, [token, navigate]);

    useEffect(() => {
        async function fetchdata() {
            try {
                const res = await axios.get(`https://tekzo.onrender.com/api/checkout/${id}`, { headers: { Authorization: `Bearer ${token}` }, withCredentials: true })
                setCart(res.data)
                
            } catch (err) {
                console.log("err:", err);

            }


        }
        fetchdata()
    }, [token, id])

    const loadRazorpay = () => {
        return new Promise((resolve, reject) => {
            // Check if already loaded
            if (window.Razorpay) {
                resolve(true);
                return;
            }

            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.async = true;
            script.onload = () => resolve(true);
            script.onerror = () => reject("Razorpay SDK failed to load");
            document.body.appendChild(script);
        });
    };

    useEffect(() => {
        async function fetchUser() {
            try {
                const res = await axios.get("https://tekzo.onrender.com/api/account", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setAddresses(res.data.addresses || []);
                if (res.data.defaultAddress) {
                    setSelectedAddress(res.data.defaultAddress);
                    setAddress(res.data.defaultAddress.address);
                    setPinCode(res.data.defaultAddress.pincode);
                    setCountry(res.data.defaultAddress.country);
                }
            } catch (err) {
                console.log("Failed to fetch user account:", err);
            }
        }
        fetchUser();
    }, [token]);


    const handleplaceOrder = async (e) => {
        e.preventDefault();

        if (!cart?.cartItems || cart.cartItems.length === 0) {
            alert("Cart is empty!");
            return;
        }

        try {
            const res = await axios.post(
                'https://tekzo.onrender.com/api/orders',
                {
                    products: cart.cartItems.map(item => ({
                        product: item._id, // fix here
                        quantity: item.quantity
                    })),
                    phone,
                    email,
                    shippingAddress: {
                        address,
                        pincode: pinCode,
                        country
                    },
                    status: paymentMethod === "COD" ? "pending" : "placed", // lowercase
                    paymentMethod,
                    totalAmount: (cart?.totalCartPrice || 0) + 62.40
                },
                { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
            );


            if (paymentMethod === "COD") {
               
                navigate(`/orders/${res.data._id}`);
            } else {
                const scriptLoaded = await loadRazorpay();
                if (!scriptLoaded) {
                    alert("Failed to load Razorpay SDK. Please try again.");
                    return;
                }
                const { order, key } = res.data
                

                const options = {
                    key, // Replace with your Razorpay key_id
                    amount: order.amount,  // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
                    currency: 'INR',
                    name: 'Tekzo',
                    description: 'Test Transaction',
                    order_id: order.id, // This is the order_id created in the backend
                    handler: async function (response) {
                        // Razorpay sends paymentId, orderId, signature
                        try {
                            await axios.post(
                                "https://tekzo.onrender.com/api/paymentVerification",
                                {
                                    orderId: res.data.orderId, // your DB orderId
                                    razorpay_order_id: response.razorpay_order_id,
                                    razorpay_payment_id: response.razorpay_payment_id,
                                    razorpay_signature: response.razorpay_signature
                                },
                                { headers: { Authorization: `Bearer ${token}` } }  // send token here
                            );

                            navigate(`/orders/${res.data.orderId}`);
                        } catch (err) {
                            console.error("Payment verification failed:", err.response?.data || err.message);
                            alert("Payment verification failed. Contact support.");
                        }
                    },
                    prefill: {
                        name: 'Customer',
                        email,
                        contact: phone
                    },
                    theme: {
                        color: '#F37254'
                    },
                };

                const rzp = new Razorpay(options);
                rzp.open();
            }
        } catch (err) {
            console.error("Order failed:", err.response?.data || err.message);
            alert("Something went wrong while placing order.");
        }
    };




    return (
        <section className='min-h-screen bg-black text-white'>
            <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-36 pt-24 pb-16'>
                <div className='py-4 w-full'>
                    <button className='flex justify-center items-center bg-[#0d0d0d] bg-opacity-[12%] px-4 rounded-xl font-bold text-sm gap-2 transition-all duration-500 ease-in-out hover:bg-slate-400/20 py-2' onClick={() => {
                        navigate('/cart')
                    }}>
                        <div className='flex justify-center items-center'>
                            <i className="fa-regular fa-circle-left"></i>
                        </div>
                        <span className='text-sm'>Back to Cart</span>
                    </button>
                </div>
                <div className='pb-4 w-full'>
                    <h2 className='text-2xl sm:text-3xl font-bold'>Checkout</h2>
                    <p className='text-sm sm:text-base text-gray-400'>Complete your purchase</p>
                </div>
                <form onSubmit={handleplaceOrder}>

                    <div className='flex flex-col lg:flex-row gap-6 justify-between items-start w-full'>


                        <div className='w-full lg:w-2/3 bg-black rounded-xl shadow-2xl flex flex-col gap-6'>
                            <div className='flex flex-col justify-between items-start gap-4 p-5 border border-gray-700/70 rounded-xl'>
                                <span className='text-lg font-bold'>Contact Details</span>

                                <div className="flex flex-col w-full gap-4 text-white">
                                    <div className='flex flex-col gap-2'>
                                        <label for="mobile" className='text-xs font-bold'>Mobile</label>
                                        <input type="number" id="phone" value={phone} className="rounded-xl px-2 py-2 text-sm bg-black border border-gray-400/20 outline-none" name="mobile" required
                                            placeholder="123456789" onChange={
                                                (e) => { setPhone(e.target.value) }
                                            }></input>
                                    </div>

                                    <div className='flex flex-col gap-2'>
                                        <label for="email" className='text-xs font-bold'>Email</label>
                                        <input type="email" id="email" value={email} className="rounded-xl px-2 py-2 text-sm bg-black border border-gray-400/20 outline-none" name="email" required
                                            placeholder="@mail.com"
                                            onChange={(e) => setEmail(e.target.value)}
                                        ></input>
                                    </div>
                                </div>
                            </div>
                            <div className='flex flex-col justify-between items-start gap-4 p-5 border border-gray-700/70 rounded-xl'>
                                <span className='text-lg font-bold'>Shipping Information</span>

                                <div className="flex flex-col w-full gap-4 text-white">
                                    <div className='flex flex-col gap-2'>
                                        <label for="address" className='text-xs font-bold'>Address</label>
                                        <input type="text" id="address" value={address} className="rounded-xl px-2 py-2 text-sm bg-black border border-gray-400/20 outline-none" name="address" required
                                            placeholder="123 Main St" onChange={(e) => { setAddress(e.target.value) }}></input>
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <label for="pincode" className='text-xs font-bold'>Pincode</label>
                                        <input type="text" id="pincode" value={pinCode} className="rounded-xl px-2 py-2 text-sm bg-black border border-gray-400/20 outline-none" name="pincode" required
                                            placeholder="100001" onChange={(e) => {
                                                setPinCode(e.target.value)
                                            }}></input>
                                    </div>

                                    <div className='flex flex-col gap-2'>
                                        <label for="country" className='text-xs font-bold'>County</label>
                                        <input type="text" id="country" value={country} className="rounded-xl px-2 py-2 text-sm bg-black border border-gray-400/20 outline-none" name="country" required
                                            placeholder="India" onChange={(e) => { setCountry(e.target.value) }}></input>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <span className="text-lg font-bold">Shipping Address</span>
                                        {addresses.map(addr => (
                                            <label key={addr._id} className="flex items-center gap-2 text-sm cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="address"
                                                    value={addr._id}
                                                    checked={selectedAddress?._id === addr._id}
                                                    onChange={() => {
                                                        setSelectedAddress(addr);
                                                        setAddress(addr.address);
                                                        setPinCode(addr.pincode);
                                                        setCountry(addr.country);
                                                    }}
                                                />
                                                <span>
                                                    {addr.address}, {addr.pincode}, {addr.country}
                                                    {addr.is_default && <span className="ml-2 text-green-400">(Default)</span>}
                                                </span>
                                            </label>
                                        ))}
                                    </div>



                                </div>
                            </div>

                            <div className='flex justify-between items-CENTER gap-4 p-5 border border-gray-700/70 rounded-xl'>
                                <span className='text-lg font-bold'>Payment Method</span>
                                <div className='flex gap-4'>
                                    <label className='flex items-center gap-2 text-sm font-bold cursor-pointer'>
                                        <input
                                            type="radio"
                                            name="payment-method"
                                            value="COD"
                                            checked={paymentMethod === "COD"}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                        />

                                        COD
                                    </label>

                                    <label className='flex items-center gap-2 text-sm font-bold cursor-pointer'>
                                        <input
                                            type="radio"
                                            name="payment-method"
                                            value="Online"
                                            checked={paymentMethod === "Online"}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                        />
                                        Online
                                    </label>
                                </div>
                            </div>
                        </div>


                        <div className='w-full lg:w-1/3 bg-black border border-gray-700/70 rounded-xl shadow-2xl h-auto lg:h-[40vh] p-4 flex flex-col gap-4'>

                            <div className='flex flex-col gap-6 border-1 border-b border-gray-700/70 pb-5'>
                                <span className='text-base font-bold'>Order Summary</span>
                                <div className='flex flex-col gap-4 text-xs'>
                                    <div className='flex justify-between'>
                                        <span className='text-gray-400'>Subtotal</span>
                                        <span className='font-bold'>${cart?.totalCartPrice || 0}</span>
                                    </div>
                                    <div className='flex justify-between'>
                                        <span className='text-gray-400'>Shipping</span>
                                        <span className='font-bold'>Free</span>
                                    </div>
                                    <div className='flex justify-between'>
                                        <span className='text-gray-400'>Tax</span>
                                        <span className='font-bold'>$62.40</span>
                                    </div>
                                </div>
                            </div>
                            <div className='flex justify-between'>
                                <span className='font-bold'>Total</span>
                                <span className='font-bold text-[#5694F7]' >${((cart?.totalCartPrice || 0) + 62.2).toFixed(2)}</span>
                            </div>
                            <div className=''>

                                <button className='flex justify-center items-center bg-[#5694F7] w-full rounded-xl font-bold text-xs gap-2 transform transition-all duration-500 ease-in-out hover:shadow-[0_0_12px_#5694F7] hover:scale-x-105 py-2' type='submit'>
                                    <span>Place Order</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </section>
    )
}
