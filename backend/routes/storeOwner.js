const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/auth');
const { Store, Rating, User, sequelize } = require('../models/index');
const { Op } = require('sequelize');

// Middleware stack for all Store Owner routes
const storeOwnerAuth = [protect, restrictTo(['StoreOwner'])];

// @route   GET /api/owner/dashboard
// @desc    Store Owner Dashboard: Avg Rating & Users who rated their store
router.get('/dashboard', storeOwnerAuth, async (req, res, next) => {
    try {
        const userId = req.user.id;
        
        // 1. Find the store owned by the logged-in user
        const store = await Store.findOne({ 
            where: { ownerId: userId },
            attributes: ['id', 'name', 'address'] // Select necessary store info
        });
        
        if (!store) {
            // If the user has the 'StoreOwner' role but no store is linked
            return res.status(404).json({ message: 'Store not found or not linked to this owner.' });
        }
        
        const storeId = store.id;

        // 2. Calculate Average Rating and Total Ratings
        const avgRatingResult = await Rating.findOne({
            attributes: [
                [sequelize.fn('AVG', sequelize.col('rating')), 'averageRating'],
                [sequelize.fn('COUNT', sequelize.col('rating')), 'totalRatings']
            ],
            where: { StoreId: storeId },
            raw: true,
        });

        const averageRating = parseFloat(avgRatingResult.averageRating || 0).toFixed(2);
        const totalRatings = parseInt(avgRatingResult.totalRatings || 0);

        // 3. Get list of users who submitted ratings for this store
        const ratingUsers = await Rating.findAll({
            where: { StoreId: storeId },
            // Include the User details (name, email, address) of the rater
            include: [{ 
                model: User, 
                attributes: ['id', 'name', 'email', 'address'] 
            }],
            attributes: ['rating', 'createdAt'],
            order: [['createdAt', 'DESC']]
        });

        const usersWhoRated = ratingUsers.map(r => ({
            rating: r.rating,
            submissionDate: r.createdAt,
            user: r.User
        }));

        res.json({
            storeName: store.name,
            storeAddress: store.address,
            averageRating: averageRating,
            totalRatings: totalRatings,
            usersWhoRated: usersWhoRated,
        });

    } catch (err) {
        next(err);
    }
});

module.exports = router;