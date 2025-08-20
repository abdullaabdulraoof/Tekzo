const express = require('express')
const router = express.Router()
const userController = require("../controller/userController")
const {auth} = require("../middleware/auth")

// Authentication
router.post('/signup', userController.userSignup)
router.post('/login', userController.userLogin)
router.post('/logout', userController.userLogout)

// Products
router.get('/products', auth, userController.showProducts)
router.get('/products/productDetails/:id', auth, userController.showProductDetails)

router.post('/products/cart', auth, userController.addToCart)

module.exports = router
