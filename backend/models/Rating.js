// backend/models/Rating.js (Updated)

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Rating = sequelize.define('Rating', {
    // ... (other fields)
    rating: { 
        type: DataTypes.INTEGER, 
        allowNull: false,
        validate: { 
            min: 1, 
            max: 5
        }
    },
    // ...
}, {
    timestamps: true,
    
    // 🚨 ADD THIS BLOCK TO DEFINE THE UNIQUE CONSTRAINT CORRECTLY
    indexes: [
        {
            unique: true,
            fields: ['UserId', 'StoreId'], // The two foreign keys for the composite index
            name: 'unique_user_store_rating_index'
        }
    ]
});

module.exports = Rating;