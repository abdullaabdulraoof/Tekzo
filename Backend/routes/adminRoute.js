const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload')
const adminController = require('../controller/adminController')
const auth = require("../middleware/auth")



router.post('/login',adminController.adminLogin)
router.post('/logout', adminController.adminLogout)

router.post('/addproduct', auth, upload.array("images", 5), adminController.addProduct)
router.get('/productList', auth,adminController.getProduct)
router.delete('/delete-product/:id', auth, adminController.deleteProduct)
router.get('/Editproduct/:id', auth, adminController.displayEditProduct)
router.put('/Editproduct/:id', auth, upload.array("images", 5) ,adminController.editProduct)

module.exports = router;