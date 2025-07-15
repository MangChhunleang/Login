const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createUser, findUserByEmail, findUserById, updateUser } = require('../models/userModel');

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ message: 'Access token required' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        req.userId = decoded.id;
        next();
    });
};

const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }
       
        console.log('Registering user with email:', email);

        const hash = await bcrypt.hash(password, 10);
        console.log('Password hashed successfully');

        await createUser({ username, email, password: hash });
        console.log('User created in database');
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Error creating user' });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log('Login attempt for email:', email);
        console.log('Password provided:', password);

        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        console.log('User found:', { id: user.id, email: user.email });
        console.log('Stored password hash:', user.password);

        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Password match result:', isMatch);
        
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Error during login' });
    }
};

const getProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await findUserById(userId);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Don't send password in response
        const { password, ...userProfile } = user;
        res.status(200).json(userProfile);
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ message: 'Error finding user' });
    }
};

const updateProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const { username, email } = req.body;

        if (!username && !email) {
            return res.status(400).json({ message: 'At least one field is required' });
        }

        const updateData = {};
        if (username) updateData.username = username;
        if (email) updateData.email = email;

        await updateUser(userId, updateData);
        res.status(200).json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ message: 'Error updating user' });
    }
};

const logout = (req, res) => {
    // In a real application, you might want to blacklist the token
    // For now, we'll just return a success message
    // The client should remove the token from storage
    res.status(200).json({ message: 'Logged out successfully' });
};

module.exports = {
    register,
    login,
    getProfile,
    updateProfile,
    logout,
    verifyToken
};
