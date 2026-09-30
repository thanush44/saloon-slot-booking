const express = require('express');
const router = express.Router();
const { login, getMe, registerAdmin } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/register', registerAdmin);

module.exports = router;
