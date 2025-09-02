        const Product = require('../model/product')
        const Admin = require('../model/admin')
        const Order = require('../model/order')
        const User = require('../model/user')
        const fs = require('fs')
        const path = require('path')
        const bcrypt = require('bcryptjs')
        const jwt = require("jsonwebtoken")
        const dotenv = require('dotenv')



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
                    const hashedPassword = await bcrypt.hash("1234", salt)

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
                const orders = await Order.find()
                res.json({ orders })
            } catch (error) {
                res.status(500).json({ success: false, message: error.message });
            }

        }