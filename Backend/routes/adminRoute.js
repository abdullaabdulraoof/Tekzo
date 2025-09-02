const express = require('express');
const router = express.Router();
const { upload } = require("../config/cloudinaryConfig");

const adminController = require('../controller/adminController')
const { isAdmin, auth } = require("../middleware/auth")



router.post('/login',adminController.adminLogin)
router.post('/logout', adminController.adminLogout)

router.post('/addproduct', auth, isAdmin, upload.array("images", 5), adminController.addProduct)
router.get('/productList', auth, isAdmin,adminController.getProduct)
router.delete('/delete-product/:id', auth, isAdmin, adminController.deleteProduct)
router.get('/Editproduct/:id', auth, isAdmin, adminController.displayEditProduct)
router.put('/Editproduct/:id', auth, isAdmin, upload.array("images", 5) ,adminController.editProduct)

router.get('/usersList' , auth,adminController.getUsers)
router.get('/ordersList', auth, adminController.getOrders)

module.exports = router;