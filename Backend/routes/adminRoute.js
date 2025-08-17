const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload')
const adminController = require('../controller/adminController')



router.post('/addproduct', upload.array("images", 5), adminController.addProduct)
router.get('/productList', adminController.getProduct)
router.delete('/delete-product/:id', adminController.deleteProduct)
router.get('/Editproduct/:id', adminController.displayEditProduct)
router.put('/Editproduct/:id', upload.array("images", 5) ,adminController.editProduct)

module.exports = router;