const StoreProduct = require('../models/StoreProduct');
const StoreOrder = require('../models/StoreOrder');
const User = require('../models/User');
const TokenTransaction = require('../models/TokenTransaction');
const { createNotification } = require('../utils/notificationService');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/apiResponse');

// ─── GET /api/store/products ────────────────────────────────────────────────
exports.getProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const filter = { isAvailable: true };
    if (req.query.category && req.query.category !== 'All') {
      filter.category = req.query.category;
    }
    if (req.query.search) {
      filter.name = { $regex: req.query.search, $options: 'i' };
    }

    const [products, total] = await Promise.all([
      StoreProduct.find(filter).sort({ isFeatured: -1, createdAt: -1 }).skip(skip).limit(limit),
      StoreProduct.countDocuments(filter),
    ]);

    return paginatedResponse(res, products, total, page, limit);
  } catch (err) {
    next(err);
  }
};

// ─── GET /api/store/products/:id ────────────────────────────────────────────
exports.getProduct = async (req, res, next) => {
  try {
    const product = await StoreProduct.findById(req.params.id);
    if (!product) return errorResponse(res, 'Product not found', 404);
    return successResponse(res, product);
  } catch (err) {
    next(err);
  }
};

// ─── POST /api/store/redeem ─────────────────────────────────────────────────
exports.redeemProduct = async (req, res, next) => {
  try {
    const { productId, deliveryInfo, notes } = req.body;
    const userId = req.user.id;

    const product = await StoreProduct.findById(productId);
    if (!product || !product.isAvailable) {
      return errorResponse(res, 'Product is unavailable', 400);
    }

    if (product.stock === 0) {
      return errorResponse(res, 'Product is out of stock', 400);
    }

    const user = await User.findById(userId);
    if (!user) return errorResponse(res, 'User not found', 404);

    if (user.tokenBalance < product.tokenPrice) {
      return errorResponse(
        res,
        `Insufficient tokens. Required: ${product.tokenPrice}, Balance: ${user.tokenBalance}`,
        400
      );
    }

    // Deduct tokens
    const balanceBefore = user.tokenBalance;
    const balanceAfter = balanceBefore - product.tokenPrice;

    user.tokenBalance = balanceAfter;
    await user.save();

    // Create Order
    const order = await StoreOrder.create({
      user: userId,
      product: product._id,
      tokensSpent: product.tokenPrice,
      status: product.category === 'Digital' ? 'completed' : 'pending',
      deliveryInfo: deliveryInfo || {},
      digitalDelivery: {
        activated: product.category === 'Digital',
        details: product.category === 'Digital' ? `Digital reward "${product.name}" unlocked.` : '',
      },
      notes: notes || '',
    });

    // Record Token Transaction
    await TokenTransaction.create({
      user: userId,
      type: 'spent',
      amount: product.tokenPrice,
      reason: `Redeemed store reward: ${product.name}`,
      activityType: 'store_redeem',
      orderId: order._id,
      balanceBefore,
      balanceAfter,
    });

    // Decrement stock if finite
    if (product.stock > 0) {
      product.stock -= 1;
      await product.save();
    }

    // Notify user
    await createNotification(
      userId,
      'order_success',
      'Store Redemption Successful!',
      `You redeemed ${product.name} for ${product.tokenPrice} ACE Tokens.`,
      { orderId: order._id, productName: product.name }
    );

    return successResponse(res, order, 'Product redeemed successfully', 201);
  } catch (err) {
    next(err);
  }
};

// ─── GET /api/store/orders ──────────────────────────────────────────────────
exports.getOrders = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      StoreOrder.find({ user: req.user.id })
        .populate('product')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      StoreOrder.countDocuments({ user: req.user.id }),
    ]);

    return paginatedResponse(res, orders, total, page, limit);
  } catch (err) {
    next(err);
  }
};

