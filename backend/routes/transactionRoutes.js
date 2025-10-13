const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const { Op, Sequelize } = require('sequelize');

// Helper to convert month name to SQL MONTH number (e.g., March -> 03)
const getMonthNumber = (monthName) => {
    // Standardizes month name to number (1-12)
    const monthIndex = new Date(Date.parse(monthName + " 1, 2022")).getMonth() + 1;
    return String(monthIndex).padStart(2, '0');
};

// @route   GET /api/transactions
// @desc    List transactions with search and pagination
router.get('/', async (req, res) => {
    const { page = 1, perPage = 10, search = '', month = 'March' } = req.query;
    const monthNumber = getMonthNumber(month);
    
    // 1. Filter by Month (using SQLite's strftime to extract month number)
    const monthFilter = Sequelize.where(
        Sequelize.fn("strftime", "%m", Sequelize.col("dateOfSale")),
        monthNumber
    );

    let where = {
        [Op.and]: [monthFilter]
    };

    // 2. Add Search Filter (for Title, Description, or Price)
    if (search) {
        // If the search term is a valid number, include price search
        const isNumeric = !isNaN(parseFloat(search)) && isFinite(search);
        
        const searchConditions = {
            [Op.or]: [
                { title: { [Op.like]: `%${search}%` } },
                { description: { [Op.like]: `%${search}%` } },
                ...(isNumeric ? [{ price: parseFloat(search) }] : []) // Exact price match if numeric
            ]
        };
        where[Op.and].push(searchConditions);
    }

    try {
        const limit = parseInt(perPage);
        const offset = (parseInt(page) - 1) * limit;

        const { count, rows } = await Transaction.findAndCountAll({
            where,
            limit,
            offset,
            order: [['dateOfSale', 'DESC']]
        });

        res.json({
            total: count,
            page: parseInt(page),
            perPage: limit,
            transactions: rows,
        });

    } catch (err) {
        console.error('Error fetching transactions:', err.message);
        res.status(500).json({ error: 'Failed to retrieve transactions.' });
    }
});

// @route   GET /api/transactions/statistics
// @desc    Calculate total sales, sold, and unsold items for the selected month
router.get('/statistics', async (req, res) => {
    const { month = 'March' } = req.query;
    const monthNumber = getMonthNumber(month);
    
    const monthFilter = Sequelize.where(
        Sequelize.fn("strftime", "%m", Sequelize.col("dateOfSale")),
        monthNumber
    );

    try {
        // Total Sale Amount (only for sold items)
        const totalSales = await Transaction.sum('price', {
            where: {
                [Op.and]: [monthFilter, { sold: true }]
            }
        });

        // Total Sold Items
        const totalSold = await Transaction.count({
            where: {
                [Op.and]: [monthFilter, { sold: true }]
            }
        });

        // Total Unsold Items
        const totalUnsold = await Transaction.count({
            where: {
                [Op.and]: [monthFilter, { sold: false }]
            }
        });

        res.json({
            month: month,
            totalSaleAmount: parseFloat(totalSales || 0).toFixed(2),
            totalSoldItems: totalSold,
            totalUnsoldItems: totalUnsold,
        });
    } catch (err) {
        console.error('Error fetching statistics:', err.message);
        res.status(500).json({ error: 'Failed to retrieve statistics.' });
    }
});

module.exports = router;