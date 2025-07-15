const express = require('express');
const router = express.Router();
const { register, login, getProfile, updateProfile, logout, verifyToken } = require('../controllers/authController');

// Public routes (no authentication required)
router.post('/register', register);
router.post('/login', login);

// Protected routes (authentication required)
router.get('/profile', verifyToken, getProfile);
router.put('/profile', verifyToken, updateProfile);
router.delete('/logout', verifyToken, logout);

module.exports = router;