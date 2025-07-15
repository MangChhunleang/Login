const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const session = require('express-session');
const passport = require('./config/passport');
const authRoutes = require('./routes/auth');
const googleAuthRoutes = require('./routes/googleAuth');

dotenv.config();
const app = express();

// CORS configuration for production
const allowedOrigins = [
  'http://localhost:3000',
  'https://secure-auth-ozz2.onrender.com'
];
const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-session-secret',
    resave: false,
    saveUninitialized: false
}));

// Initialize Passport
app.use(passport.initialize());

app.use('/api/auth', authRoutes);
app.use('/api/auth', googleAuthRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'SecureAuth API is running!' });
});

// Handle 404 errors
app.use('*', (req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Add error handling middleware (after routes)
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ message: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`SecureAuth API running on port ${PORT}`);
});

