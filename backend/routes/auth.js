const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

// --- CRITICAL PATHS ---
// Adjust the path if your models folder is not directly one level up (../)
const { User } = require('../models/index'); 
const { protect } = require('../middleware/auth');
const { validateSignup } = require('../middleware/validation');
// ---

// Helper to generate JWT
const generateToken = (id, role) => {
    // NOTE: This relies on process.env.JWT_SECRET being loaded in server.js
    if (!process.env.JWT_SECRET) {
        // This is a safety check; the error should ideally be caught during server startup.
        throw new Error('JWT secret not configured.');
    }
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: '1d',
    });
};

// @route   POST /api/auth/signup
// @desc    Register a new Normal User
router.post('/signup', validateSignup, async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, email, password, address } = req.body;
    try {
        let user = await User.findOne({ where: { email } });
        if (user) return res.status(400).json({ message: 'User already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Role is hardcoded to 'NormalUser' for signup route
        user = await User.create({ name, email, password: hashedPassword, address, role: 'NormalUser' }); 

        res.status(201).json({
            id: user.id,
            role: user.role,
            token: generateToken(user.id, user.role),
        });
    } catch (err) {
        next(err); // Pass error to central handler
    }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
router.post('/login', async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ where: { email } });
        
        // 1. Check if user exists
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        // 2. Compare password hash
        if (!(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // 3. Success: Generate token and return user details
        res.json({
            id: user.id,
            role: user.role,
            token: generateToken(user.id, user.role),
        });

    } catch (err) {
        next(err); // Pass error to central handler
    }
});

// @route   GET /api/auth/me
// @desc    Return current logged-in user's details (protected)
router.get('/me', protect, async (req, res, next) => {
    try {
        const user = await User.findByPk(req.user.id, { attributes: { exclude: ['password'] } });
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json({ id: user.id, name: user.name, email: user.email, address: user.address, role: user.role });
    } catch (err) {
        next(err);
    }
});

// @route   PUT /api/auth/update-password
// @desc    Update password for logged in user
router.put('/update-password', protect, async (req, res, next) => {
    const { newPassword } = req.body;
    // NOTE: Password validation should ideally be repeated here for newPassword
    
    try {
        const user = await User.findByPk(req.user.id);
        
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.json({ message: 'Password updated successfully' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;