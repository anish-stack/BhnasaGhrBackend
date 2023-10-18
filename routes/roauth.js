// routes/auth.js

const express = require('express');
const router = express.Router();
const { logoutUser,getAllUsers,updateUserProfile, AddProfile, getUserAndProfile, Whislishts } = require('../controllers/usercontroller');
const { protect,isAdmin } = require('../middleware/auth');
const { createProduct,getProductById,getAllProducts,updateProducts, deleteProduct, addToCart, shareSessionCartToUserCart, addReview } = require('../controllers/productController');
const { createOrder, getOrderDetailById, getUserOrders,  } = require('../controllers/orderController');

router.get('/logout', protect, logoutUser);
router.route('/Prodile-change').post(protect,updateUserProfile)
router.post('/make-a-order',protect,createOrder)
router.get('/getOrderDetails/:id',protect,getOrderDetailById)
// ====== Admin users And Routes
router.get('/All-users',protect,isAdmin('admin'),getAllUsers)
router.post('/create-product',protect,isAdmin('admin'),createProduct)
router.get('/products/:id', protect,isAdmin('admin'), getProductById);
router.get('/All-products' ,protect,isAdmin('admin'),getAllProducts)
router.put('/products/:id',protect,isAdmin('admin'), updateProducts);
router.delete('/delete/:id',protect,isAdmin('admin'), deleteProduct);
router.get('/All-Product',getAllProducts)


router.get('/productDetails/:id',getProductById);
router.get('/UserOrders',protect,getUserOrders);

router.post('/user-profile',protect,AddProfile);
router.get('/user-info',protect,getUserAndProfile);
router.post('/whislist',protect,Whislishts)
router.post('/addToCart',addToCart)
router.post('/reviews/:id',protect,addReview)

router.post('/addToCartSession',protect,shareSessionCartToUserCart)



module.exports = router;
