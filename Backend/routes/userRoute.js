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

//Cart
router.post('/cart', auth, userController.addToCart)
router.get('/cart', auth, userController.getCart)
router.delete('/cart/:id', auth, userController.deleteItem)
router.put('/cart', auth, userController.changeQuantity)

module.exports = router
