        const Product = require('../model/product')
        const Admin = require('../model/admin')
        const Order = require('../model/order')
        const User = require('../model/user')
        const fs = require('fs')
        const path = require('path')
        const bcrypt = require('bcryptjs')
        const jwt = require("jsonwebtoken")
        const dotenv = require('dotenv')
        const axios = require('axios')
        const { getIO } = require('../utils/socket')



        exports.addProduct = async (req, res) => {
            try {
                const { name, sku, desc, price, offerPrice, category, tag, stockQty, brandName } = req.body
                // Use paths from Multer
                const imageUrls = req.files.map(file => file.path); // Cloudinary gives permanent URLs

                const product = new Product({
                    name,
                    sku,
                    desc,
                    price,
                    offerPrice,
                    category,
                    tag,
                    stockQty,
                    brandName,
                    images: imageUrls

                })
                await product.save()

                // Trigger AI vectorstore re-index asynchronously
                axios.post('http://localhost:8001/reindex').catch(err => console.error("FAISS sync failed:", err.message));
                
                // Emit socket event for real-time refresh
                getIO().emit("productChanged");

                res.status(201).json({ success: true, product })
            } catch (err) {
                res.status(500).json({ success: false, message: err.message })
            }

        }
        exports.getProduct = async (req, res) => {
            try {
                const products = await Product.find()
                res.status(201).json({ success: true, products })
            } catch (err) {
                res.status(500).json({ success: false, message: err.message })
            }
        }

        exports.deleteProduct = async (req, res) => {

            try {
                const { id } = req.params
                const result = await Product.findByIdAndDelete(id)
                if (!result) {
                    return res.status(404).json({ success: false, message: "Product not found" });
                }

                // Trigger AI vectorstore re-index asynchronously
                axios.post('http://localhost:8001/reindex').catch(err => console.error("FAISS sync failed:", err.message));
                
                // Emit socket event for real-time refresh
                getIO().emit("productChanged");

                res.status(201).json({ success: true, result })
            } catch (err) {
                res.status(500).json({ success: false, message: err.message })
            }
        }

        exports.displayEditProduct = async (req, res) => {

            try {
                const { id } = req.params
                const product = await Product.findById(id)

                res.status(201).json({ success: true, product })
            } catch (err) {
                res.status(500).json({ success: false, message: err.message })
            }
        }

        exports.editProduct = async (req, res) => {
            try {
                const { id } = req.params;
                const { name, sku, desc, price, offerPrice, category, tag, stockQty, brandName } = req.body;



                const UpdateData = {
                    name,
                    sku,
                    desc,
                    price,
                    offerPrice,
                    category,
                    tag,
                    stockQty,
                    brandName,
                };

                // If new images are uploaded, replace with Cloudinary URLs
                if (req.files && req.files.length > 0) {
                    UpdateData.images = req.files.map(file => file.path);
                }

                const product = await Product.findByIdAndUpdate(id, UpdateData, { new: true });

                if (!product) {
                    return res.status(404).json({ success: false, message: "Product not found" });
                }

                // Trigger AI vectorstore re-index asynchronously
                axios.post('http://localhost:8001/reindex').catch(err => console.error("FAISS sync failed:", err.message));
                
                // Emit socket event for real-time refresh
                getIO().emit("productChanged");

                res.status(200).json({ success: true, product });
            } catch (err) {
                res.status(500).json({ success: false, message: err.message });
            }
        };

        exports.adminLogin = async (req, res) => {
            const { username, password } = req.body
            try {
                let admin = await Admin.findOne({ username })
                if (!admin) {

                    const salt = await bcrypt.genSalt(10)
                    const defaultPassword = process.env.DEFAULT_ADMIN_PASSWORD || "1234";
                    const hashedPassword = await bcrypt.hash(defaultPassword, salt)

                    admin = new Admin({
                        username: "admin",
                        password: hashedPassword
                    })
                    await admin.save()

                    return res.status(201).json({ message: "default admin created" });
                }

                const verify = await bcrypt.compare(password, admin.password)
                if (!verify) {
                    return res.status(400).json({ message: "password is incorrect" });

                }
                const payload = {
                    id: admin.id,
                    role: admin.role
                }
                jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 36000 }, (err, token) => {
                    if (err) throw err;
                    res.json({ token });
                });


            } catch (error) {
                res.status(500).json({ success: false, message: error.message });
            }

        }


        exports.adminLogout = async (req, res) => {
            res.status(200).json({ message: "Logged out successfully" });
        };


        exports.getUsers = async (req, res) => {
            try {
                const admin = req.user.id
                if (!admin) {
                    return res.status(401).json({ err: "admin is not found" })
                }
                const users = await User.find()
                res.json({ users})
            } catch (error) {
                res.status(500).json({ success: false, message: error.message });
            }

        }

        exports.getOrders = async (req, res) => {
            try {
                const admin = req.user.id
                if (!admin) {
                    return res.status(401).json({ err: "admin is not found" })
                }
                const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 })
                res.json({ orders })
            } catch (error) {
                res.status(500).json({ success: false, message: error.message });
            }

        }

        exports.updateOrderStatus = async (req, res) => {
            try {
                const { id } = req.params;
                const { status, message } = req.body;

                const order = await Order.findByIdAndUpdate(
                    id,
                    { 
                        status,
                        $push: { trackingHistory: { status, message, timestamp: new Date() } }
                    },
                    { new: true }
                );

                if (!order) {
                    return res.status(404).json({ success: false, message: "Order not found" });
                }

                // Trigger real-time update for the user
                getIO().emit("orderStatusChanged", { 
                    orderId: id, 
                    userId: order.user.toString(), 
                    status 
                });

                res.status(200).json({ success: true, order });
            } catch (err) {
                res.status(500).json({ success: false, message: err.message });
            }
        };

        exports.handleOrderRequest = async (req, res) => {
            try {
                const { id } = req.params;
                const { action, adminMessage } = req.body; // action: 'approve' | 'reject'

                const order = await Order.findById(id);
                if (!order || order.request.status !== 'pending') {
                    return res.status(400).json({ success: false, message: "No pending request found for this order" });
                }

                if (action === 'approve') {
                    order.request.status = 'approved';
                    // Automatically update main order status
                    if (order.request.requestType === 'cancel') {
                        order.status = 'cancelled';
                    } else if (order.request.requestType === 'return') {
                        order.status = 'returned';
                    }
                    order.trackingHistory.push({
                        status: order.status,
                        timestamp: new Date(),
                        message: `Request approved by Admin. ${adminMessage || ''}`
                    });
                } else if (action === 'reject') {
                    order.request.status = 'rejected';
                    order.trackingHistory.push({
                        status: order.status, // stays the same
                        timestamp: new Date(),
                        message: `Request rejected by Admin. Reason: ${adminMessage || ''}`
                    });
                }

                await order.save();

                // Notify User
                getIO().emit("orderStatusChanged", { 
                    orderId: id, 
                    userId: order.user.toString(), 
                    status: order.status,
                    requestStatus: order.request.status
                });

                res.status(200).json({ success: true, message: `Request ${action}ed successfully`, order });
            } catch (err) {
                res.status(500).json({ success: false, message: err.message });
            }
        };