const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
    id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true,
        autoIncrement: true
    },
    name: { 
        type: DataTypes.STRING, 
        allowNull: false 
        // Validation check for min 20 / max 60 should be enforced here or primarily via express-validator
    },
    email: { 
        type: DataTypes.STRING, 
        allowNull: false, 
        unique: true,
        validate: { isEmail: true }
    },
    password: { 
        type: DataTypes.STRING, 
        allowNull: false 
        // Stores the hashed password (bcrypt hash is usually 60 chars)
    },
    address: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    role: {
        type: DataTypes.ENUM('Admin', 'NormalUser', 'StoreOwner'),
        allowNull: false,
        defaultValue: 'NormalUser'
    },
}, {
    // Other model options
});

module.exports = User;