const express = require('express')
const { RegisterUser, loginguser,changePassword, verifyOTPAndChangePassword,   } = require('../controllers/usercontroller')
const { protect } = require('../middleware/auth')
const { getProductsByCategories } = require('../controllers/productController')
const router = express.Router()



router.route("/register").post(RegisterUser)
router.route("/login").post(loginguser)
router.post('/change-password',changePassword)
router.route('/verifyotp').post(verifyOTPAndChangePassword)
router.get('/products/by-category',  getProductsByCategories);

module.exports = router