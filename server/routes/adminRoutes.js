const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/admin');
const {
  getOverview,
  getUsers,
  updateUser,
  getStoreProducts,
  createStoreProduct,
  updateStoreProduct,
  deleteStoreProduct,
  getOrders,
  updateOrderStatus,
  getRewardRules,
  updateRewardRule,
} = require('../controllers/adminController');

// All admin routes require authentication and admin role
router.use(protect, adminOnly);

router.get('/overview', getOverview);

router.get('/users', getUsers);
router.put('/users/:id', updateUser);

router.get('/store/products', getStoreProducts);
router.post('/store/products', createStoreProduct);
router.put('/store/products/:id', updateStoreProduct);
router.delete('/store/products/:id', deleteStoreProduct);

router.get('/orders', getOrders);
router.put('/orders/:id', updateOrderStatus);

router.get('/reward-rules', getRewardRules);
router.put('/reward-rules/:id', updateRewardRule);

module.exports = router;

