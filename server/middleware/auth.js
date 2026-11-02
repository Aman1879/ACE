const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * protect – require a valid JWT; attaches req.user = { id, role }
 */
exports.protect = async (req, res, next) => {
  try {
    let token;

    // 1. Check Authorization header (Bearer token)
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }
    // 2. Fallback to cookie
    else if (req.cookies && req.cookies.ace_token) {
      token = req.cookies.ace_token;
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authorized – no token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'ace_secret_dev_key');

    // Verify user still exists and is active if MongoDB is connected
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState === 1) {
      const user = await User.findById(decoded.id).select('_id role isActive');
      if (!user || !user.isActive) {
        return res.status(401).json({ success: false, message: 'User no longer exists or has been deactivated' });
      }
    }

    req.user = { id: decoded.id, role: decoded.role || 'student' };
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token has expired' });
    }
    next(err);
  }
};

/**
 * optionalAuth – attach req.user if valid token present; otherwise continue
 */
exports.optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.ace_token) {
      token = req.cookies.ace_token;
    }

    if (!token) {
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('_id role isActive');
    if (user && user.isActive) {
      req.user = { id: decoded.id, role: decoded.role };
    }
    next();
  } catch (_err) {
    // Token invalid – just continue as unauthenticated
    next();
  }
};
