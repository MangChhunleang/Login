const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Google OAuth login route
router.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google OAuth callback route
router.get('/google/callback',
    passport.authenticate('google', { session: false }),
    (req, res) => {
        try {
            // Generate JWT token
            const token = jwt.sign(
                { id: req.user.id },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            // Redirect to frontend with token
            res.redirect(`http://localhost:3000/auth/google/callback?token=${token}`);
        } catch (error) {
            console.error('Google OAuth callback error:', error);
            res.redirect('http://localhost:3000/login?error=google_auth_failed');
        }
    }
);

module.exports = router; 