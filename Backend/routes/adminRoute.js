const express = require('express');
const router = express.Router();
const { upload } = require("../config/cloudinaryConfig");

const adminController = require('../controller/adminController')
const { isAdmin, auth } = require("../middleware/auth")
const Product = require("../model/product");



router.post('/login',adminController.adminLogin)
router.post('/logout', adminController.adminLogout)

router.post('/addproduct', auth, isAdmin, upload.array("images", 5), adminController.addProduct)
router.get('/productList', auth, isAdmin,adminController.getProduct)
router.delete('/delete-product/:id', auth, isAdmin, adminController.deleteProduct)
router.get('/Editproduct/:id', auth, isAdmin, adminController.displayEditProduct)
router.put('/Editproduct/:id', auth, isAdmin, upload.array("images", 5) ,adminController.editProduct)

router.get('/usersList' , auth,adminController.getUsers)

router.get('/ordersList', auth, adminController.getOrders)

// =========================================
// 🔹 ADMIN AI INTELLIGENCE ROUTES (Phase 27)
// =========================================

// Low stock products (stockQty < 5)
router.get('/products/low-stock', auth, async (req, res) => {
    try {
        const products = await Product.find({ stockQty: { $lt: 5 } });
        res.json({ success: true, products });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Top selling products (newest first, as proxy until a `sold` field exists)
router.get('/products/top-selling', auth, async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 }).limit(10);
        res.json({ success: true, products });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Dead stock products (stockQty == 0 or undefined)
router.get('/products/dead-stock', auth, async (req, res) => {
    try {
        const products = await Product.find({
            $or: [
                { stockQty: { $lte: 0 } },
                { stockQty: { $exists: false } }
            ]
        });
        res.json({ success: true, products });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;