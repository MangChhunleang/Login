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
      // Redirect or respond as needed
      res.redirect('/'); // or your frontend URL
    });
  })(req, res, next);
});

module.exports = router; 