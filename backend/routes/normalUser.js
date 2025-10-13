const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/auth');
const { Store, Rating, User, sequelize } = require('../models/index');
const { Op } = require('sequelize');

// Middleware stack for all Normal User routes
const normalUserAuth = [protect, restrictTo(['NormalUser'])];

// -------------------------------------------------------------
// 1. STORE LISTING, SEARCH, & USER RATING VIEW
// -------------------------------------------------------------

// @route   GET /api/user/stores
// @desc    List all stores with overall rating, user's rating, and filtering/sorting
router.get('/stores', normalUserAuth, async (req, res, next) => {
    const { search, sortBy = 'name', order = 'ASC' } = req.query;
    const userId = req.user.id;
    let where = {};
    let sortOrder = [[sortBy, order.toUpperCase()]];

    try {
        // Filtering based on Name or Address
        if (search) {
            where[Op.or] = [
                { name: { [Op.like]: `%${search}%` } },
                { address: { [Op.like]: `%${search}%` } }
            ];
        }

        // Fetch all stores based on search/filter/sort
        const stores = await Store.findAll({
            where,
            order: sortOrder,
        });

        // Calculate ratings for each store (overall and user-specific)
        const results = await Promise.all(stores.map(async (store) => {
            
            // 1. Overall Average Rating (Computed Field)
            const avgRatingResult = await Rating.findOne({
                attributes: [
                    [sequelize.fn('AVG', sequelize.col('rating')), 'overallRating']
                ],
                where: { StoreId: store.id },
                raw: true,
            });
            const overallRating = parseFloat(avgRatingResult.overallRating || 0).toFixed(2);

            // 2. User's Submitted Rating
            const userRating = await Rating.findOne({
                where: { StoreId: store.id, UserId: userId },
                attributes: ['id', 'rating'],
            });
            
            return {
                id: store.id,
                name: store.name,
                address: store.address,
                overallRating,
                userSubmittedRating: userRating ? userRating.rating : null,
                userRatingId: userRating ? userRating.id : null, // Needed for modify/update option
            };
        }));

        res.json(results);

    } catch (err) {
        next(err);
    }
});

// -------------------------------------------------------------
// 2. RATING SUBMISSION AND MODIFICATION
// -------------------------------------------------------------

// @route   POST /api/user/ratings
// @desc    Submit or update a rating (1-5) for a store
router.post('/ratings', normalUserAuth, async (req, res, next) => {
    const { storeId, rating } = req.body;
    const userId = req.user.id;

    if (rating < 1 || rating > 5) {
        return res.status(400).json({ message: 'Rating must be between 1 and 5.' });
    }

    try {
        // Check if user has already rated this store
        let existingRating = await Rating.findOne({ 
            where: { UserId: userId, StoreId: storeId } 
        });

        if (existingRating) {
            // Case 1: MODIFY existing rating
            existingRating.rating = rating;
            await existingRating.save();
            return res.json({ message: 'Rating modified successfully.', ratingId: existingRating.id });
        } else {
            // Case 2: SUBMIT new rating
            const newRating = await Rating.create({
                UserId: userId,
                StoreId: storeId,
                rating: rating
            });
            return res.status(201).json({ message: 'Rating submitted successfully.', ratingId: newRating.id });
        }

    } catch (err) {
        // Catch Sequelize unique constraint error if logic failed the findOne check
        if (err.name === 'SequelizeUniqueConstraintError') {
             return res.status(400).json({ message: 'You have already rated this store.' });
        }
        next(err);
    }
});

module.exports = router;