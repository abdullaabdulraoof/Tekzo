const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload')
const adminController = require('../controller/adminController')



router.post('/addproduct', upload.array("images", 5), adminController.addProduct)


module.exports = router;