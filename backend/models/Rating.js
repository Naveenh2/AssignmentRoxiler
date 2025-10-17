const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Rating = sequelize.define('Rating', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    // Foreign keys (added by associations, but explicit fields help clarity)
    UserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    StoreId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: { args: [1], msg: 'Rating must be at least 1' },
            max: { args: [5], msg: 'Rating cannot exceed 5' }
        }
    }
}, {
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['UserId', 'StoreId'],
            name: 'unique_user_store_rating_index'
        }
    ]
});

module.exports = Rating;