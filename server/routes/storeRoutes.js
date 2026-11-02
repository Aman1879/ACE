const express = require('express');
const router = express.Router();
const { protect, optionalAuth } = require('../middleware/auth');
const {
  getProducts,
  getProduct,
  redeemProduct,
  getOrders,
} = require('../controllers/storeController');

// Public / Optional Auth for browsing store items
router.get('/products', optionalAuth, getProducts);
router.get('/products/:id', optionalAuth, getProduct);

// Protected routes for redeeming & orders
router.post('/redeem', protect, redeemProduct);
router.get('/orders', protect, getOrders);

module.exports = router;

