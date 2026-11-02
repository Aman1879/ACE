const User = require('../models/User');
const Project = require('../models/Project');
const Certificate = require('../models/Certificate');
const Achievement = require('../models/Achievement');
const StoreProduct = require('../models/StoreProduct');
const StoreOrder = require('../models/StoreOrder');
const RewardRule = require('../models/RewardRule');
const Badge = require('../models/Badge');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/apiResponse');

// ─── GET /api/admin/overview ────────────────────────────────────────────────
exports.getOverview = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalProjects,
      totalCertificates,
      totalAchievements,
      totalOrders,
      totalProducts,
      recentUsers,
    ] = await Promise.all([
      User.countDocuments(),
      Project.countDocuments(),
      Certificate.countDocuments(),
      Achievement.countDocuments(),
      StoreOrder.countDocuments(),
      StoreProduct.countDocuments(),
      User.find().sort({ createdAt: -1 }).limit(5).select('name email username role createdAt xp level'),
    ]);

    const stats = {
      totalUsers,
      totalProjects,
      totalCertificates,
      totalAchievements,
      totalOrders,
      totalProducts,
      recentUsers,
    };

    return successResponse(res, stats, 'Admin overview fetched');
  } catch (err) {
    next(err);
  }
};

// ─── GET /api/admin/users ───────────────────────────────────────────────────
exports.getUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } },
        { username: { $regex: req.query.search, $options: 'i' } },
      ];
    }
    if (req.query.role) filter.role = req.query.role;

    const [users, total] = await Promise.all([
      User.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('-password'),
      User.countDocuments(filter),
    ]);

    return paginatedResponse(res, users, total, page, limit);
  } catch (err) {
    next(err);
  }
};

// ─── PUT /api/admin/users/:id ───────────────────────────────────────────────
exports.updateUser = async (req, res, next) => {
  try {
    const { role, isActive } = req.body;
    const updateData = {};
    if (role !== undefined) updateData.role = role;
    if (isActive !== undefined) updateData.isActive = isActive;

    const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true }).select('-password');
    if (!user) return errorResponse(res, 'User not found', 404);

    return successResponse(res, user, 'User updated successfully');
  } catch (err) {
    next(err);
  }
};

// ─── GET /api/admin/store/products ──────────────────────────────────────────
exports.getStoreProducts = async (req, res, next) => {
  try {
    const products = await StoreProduct.find().sort({ createdAt: -1 });
    return successResponse(res, products);
  } catch (err) {
    next(err);
  }
};

// ─── POST /api/admin/store/products ─────────────────────────────────────────
exports.createStoreProduct = async (req, res, next) => {
  try {
    const product = await StoreProduct.create(req.body);
    return successResponse(res, product, 'Product created successfully', 201);
  } catch (err) {
    next(err);
  }
};

// ─── PUT /api/admin/store/products/:id ──────────────────────────────────────
exports.updateStoreProduct = async (req, res, next) => {
  try {
    const product = await StoreProduct.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) return errorResponse(res, 'Product not found', 404);
    return successResponse(res, product, 'Product updated successfully');
  } catch (err) {
    next(err);
  }
};

// ─── DELETE /api/admin/store/products/:id ───────────────────────────────────
exports.deleteStoreProduct = async (req, res, next) => {
  try {
    const product = await StoreProduct.findByIdAndDelete(req.params.id);
    if (!product) return errorResponse(res, 'Product not found', 404);
    return successResponse(res, null, 'Product deleted successfully');
  } catch (err) {
    next(err);
  }
};

// ─── GET /api/admin/orders ──────────────────────────────────────────────────
exports.getOrders = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      StoreOrder.find()
        .populate('user', 'name email username')
        .populate('product')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      StoreOrder.countDocuments(),
    ]);

    return paginatedResponse(res, orders, total, page, limit);
  } catch (err) {
    next(err);
  }
};

// ─── PUT /api/admin/orders/:id ──────────────────────────────────────────────
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status, notes } = req.body;
    const order = await StoreOrder.findByIdAndUpdate(
      req.params.id,
      { ...(status && { status }), ...(notes && { notes }) },
      { new: true }
    );
    if (!order) return errorResponse(res, 'Order not found', 404);
    return successResponse(res, order, 'Order updated');
  } catch (err) {
    next(err);
  }
};

// ─── GET /api/admin/reward-rules ────────────────────────────────────────────
exports.getRewardRules = async (req, res, next) => {
  try {
    const rules = await RewardRule.find().sort({ activityType: 1 });
    return successResponse(res, rules);
  } catch (err) {
    next(err);
  }
};

// ─── PUT /api/admin/reward-rules/:id ────────────────────────────────────────
exports.updateRewardRule = async (req, res, next) => {
  try {
    const rule = await RewardRule.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!rule) return errorResponse(res, 'Reward rule not found', 404);
    return successResponse(res, rule, 'Reward rule updated');
  } catch (err) {
    next(err);
  }
};

