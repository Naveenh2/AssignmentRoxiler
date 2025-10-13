const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/auth');
const { User, Store, Rating, sequelize } = require('../models/index');
const { validationResult } = require('express-validator');
const { validateSignup } = require('../middleware/validation'); // Reuse signup validation
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');

// Middleware stack for all Admin routes
const adminAuth = [protect, restrictTo(['Admin'])];

// Helper function to process sorting and searching query parameters
const applyListQuery = (model, query) => {
    const { search, sortBy = 'id', order = 'ASC', filterRole } = query;
    let options = {
        order: [[sortBy, order.toUpperCase()]],
        where: {}
    };

    // 1. Filter by Role (Admin Users only)
    if (model === User && filterRole) {
        options.where.role = filterRole;
    }

    // 2. Search by Name, Email, or Address
    if (search) {
        const searchFields = ['name', 'email', 'address'];
        options.where[Op.or] = searchFields.map(field => ({
            [field]: { [Op.like]: `%${search}%` }
        }));
    }
    
    return options;
};

// -------------------------------------------------------------
// 1. DASHBOARD ANALYTICS
// -------------------------------------------------------------

// @route   GET /api/admin/dashboard
// @desc    Admin Analytics Dashboard: Get total counts
router.get('/dashboard', adminAuth, async (req, res, next) => {
    try {
        const totalUsers = await User.count();
        const totalStores = await Store.count();
        const totalRatings = await Rating.count();
        
        res.json({ totalUsers, totalStores, totalRatings });
    } catch (err) {
        next(err);
    }
});

// -------------------------------------------------------------
// 2. USER MANAGEMENT (Add, List)
// -------------------------------------------------------------

// @route   POST /api/admin/users
// @desc    Add new User, Admin, or Store Owner
router.post('/users', adminAuth, validateSignup, async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, email, password, address, role } = req.body;
    
    if (!['Admin', 'NormalUser', 'StoreOwner'].includes(role)) {
        return res.status(400).json({ message: 'Invalid user role specified.' });
    }

    try {
        let user = await User.findOne({ where: { email } });
        if (user) return res.status(400).json({ message: 'User already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = await User.create({ name, email, password: hashedPassword, address, role });
        
        res.status(201).json({ message: `${role} created successfully`, user: { id: user.id, email: user.email, role: user.role } });
    } catch (err) {
        next(err);
    }
});

// @route   GET /api/admin/users
// @desc    List all Users with sorting/filtering
router.get('/users', adminAuth, async (req, res, next) => {
    try {
        const options = applyListQuery(User, req.query);
        
        const users = await User.findAll({
            ...options,
            attributes: { exclude: ['password'] },
            // Include OwnedStore information for StoreOwner check
            include: [{
                model: Store,
                as: 'OwnedStore',
                attributes: ['id'], // Only need ID to know if store exists
                required: false
            }]
        });

        // Compute average rating for Store Owners' stores dynamically
        const usersWithDetails = await Promise.all(users.map(async user => {
            let details = { 
                id: user.id, name: user.name, email: user.email, address: user.address, role: user.role, storeRating: null 
            };
            
            // If the user is a Store Owner AND has a store linked
            if (user.role === 'StoreOwner' && user.OwnedStore) {
                const avgRatingResult = await Rating.findOne({
                    attributes: [[sequelize.fn('AVG', sequelize.col('rating')), 'averageRating']],
                    where: { StoreId: user.OwnedStore.id },
                    raw: true,
                });
                details.storeRating = parseFloat(avgRatingResult.averageRating || 0).toFixed(2);
            }
            return details;
        }));

        res.json(usersWithDetails);
    } catch (err) {
        next(err);
    }
});

// -------------------------------------------------------------
// 3. STORE MANAGEMENT (Add, List)
// -------------------------------------------------------------

// @route   POST /api/admin/stores
// @desc    Add new Store and assign to an existing StoreOwner
router.post('/stores', adminAuth, async (req, res, next) => {
    const { name, email, address, ownerId } = req.body; 
    
    try {
        // 1. Check if the proposed owner exists and is designated as a StoreOwner
        const owner = await User.findOne({ where: { id: ownerId, role: 'StoreOwner' } });
        if (!owner) {
            return res.status(404).json({ message: 'Owner not found or is not a StoreOwner role.' });
        }
        
        // 2. Check if the owner already owns a store (One-to-One constraint)
        const existingStore = await Store.findOne({ where: { ownerId: ownerId } });
        if (existingStore) {
            return res.status(400).json({ message: 'This owner already owns a store.' });
        }
        
        // 3. Create the store
        const store = await Store.create({ name, email, address, ownerId });
        res.status(201).json({ message: 'Store added successfully.', store });
    } catch (err) {
        next(err);
    }
});

// @route   GET /api/admin/stores
// @desc    List all Stores with sorting/filtering and overall rating
router.get('/stores', adminAuth, async (req, res, next) => {
    try {
        const options = applyListQuery(Store, req.query);
        
        const stores = await Store.findAll({ ...options });

        // Compute average rating for each store
        const storesWithDetails = await Promise.all(stores.map(async store => {
            const avgRatingResult = await Rating.findOne({
                attributes: [[sequelize.fn('AVG', sequelize.col('rating')), 'averageRating']],
                where: { StoreId: store.id },
                raw: true,
            });
            const rating = parseFloat(avgRatingResult.averageRating || 0).toFixed(2);
            
            return {
                id: store.id,
                name: store.name,
                email: store.email,
                address: store.address,
                rating: rating
            };
        }));

        res.json(storesWithDetails);
    } catch (err) {
        next(err);
    }
});

module.exports = router;