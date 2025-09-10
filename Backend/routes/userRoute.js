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

// checkout
router.get('/checkout/:id', auth, userController.getCheckout)
router.post('/orders', auth, userController.placeOrder)

router.post('/paymentVerification', auth, userController.paymentVerification)


router.get('/getproductcard',auth,userController.getproductcard)

router.get('/ordersList', auth, userController.getorderList)

router.post("/wishlist", auth, userController.addwishlist)

router.get("/wishlist", auth, userController.getWishlist)

router.get("/account", auth, userController.getAccount)

router.get('/cart/count', auth, userController.getCartCount);

router.put('/account/accountdetails', auth, userController.updateUser)


router.put('/account/address', auth, userController.updateAddress)

router.post('/google', userController.googleLogin)

module.exports = router
