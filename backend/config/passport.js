const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { findUserByEmail, createUser, findUserById, findUserByGoogleId, updateUser } = require('../models/userModel');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await findUserById(id);
        if (!user) {
            return done(null, false);
        }
        done(null, user);
    } catch (error) {
        console.error('Deserialize user error:', error);
        done(error, null);
    }
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
    try {
        console.log('Google profile:', profile);
        
        // Check if user already exists by Google ID first
        const existingUserByGoogleId = await findUserByGoogleId(profile.id);
        if (existingUserByGoogleId) {
            console.log('User found by Google ID:', existingUserByGoogleId);
            return done(null, existingUserByGoogleId);
        }
        
        // Check if user exists by email
        const existingUser = await findUserByEmail(profile.emails[0].value);
        if (existingUser) {
            console.log('User found by email:', existingUser);
            // Update the existing user with Google ID
            await updateUser(existingUser.id, { google_id: profile.id });
            return done(null, existingUser);
        }
        
        // Create new user
        const newUser = {
            username: profile.displayName,
            email: profile.emails[0].value,
            password: 'google_oauth_user', // We'll handle this differently
            googleId: profile.id
        };
        
        console.log('Creating new user:', newUser);
        const createdUser = await createUser(newUser);
        console.log('Created user:', createdUser);
        return done(null, createdUser);
        
    } catch (error) {
        console.error('Google OAuth strategy error:', error);
        return done(error, null);
    }
}));

module.exports = passport; 