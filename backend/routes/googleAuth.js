const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Google OAuth login route
router.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google OAuth callback route
router.get('/google/callback', (req, res, next) => {
  passport.authenticate('google', (err, user, info) => {
    if (err) {
      console.error('Google OAuth callback error:', err);
      if (err.stack) {
        console.error(err.stack);
      }
      return next(err);
    }
    if (!user) {
      console.error('No user returned from Google OAuth:', info);
      return res.status(401).json({ message: 'Authentication failed' });
    }
    req.logIn(user, (err) => {
      if (err) {
        console.error('Error logging in user after Google OAuth:', err);
        return next(err);
      }
      // Generate JWT token
      const token = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      // Redirect to your deployed frontend with the token
      res.redirect(`https://secure-auth-ozz2.onrender.com/auth/google/callback?token=${token}`);
    });
  })(req, res, next);
});

module.exports = router; 