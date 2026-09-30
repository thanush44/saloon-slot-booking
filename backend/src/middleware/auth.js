const jwt = require('jsonwebtoken');
const path = require('path');
const { Admin } = require('../../../database');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized. No authentication token provided.',
    });
  }

  try {
    const secret = process.env.JWT_SECRET || 'super_secret_salon_jwt_key_2026';
    const decoded = jwt.verify(token, secret);

    const admin = await Admin.findById(decoded.id).select('-password');
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Admin account not found or has been removed.',
      });
    }

    req.admin = admin;
    next();
  } catch (error) {
    console.error('[AuthMiddleware] Token error:', error.message);
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token. Please log in again.',
    });
  }
};

module.exports = { protect };
