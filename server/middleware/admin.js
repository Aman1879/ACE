/**
 * adminOnly – must be used AFTER the protect middleware.
 * Checks that req.user.role === 'admin'.
 */
exports.adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied – admin only',
    });
  }
  next();
};
