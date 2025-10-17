const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
    id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true,
        autoIncrement: true
    },
    name: { 
        type: DataTypes.STRING(60), 
        allowNull: false,
        validate: {
            len: { args: [20, 60], msg: 'Name must be between 20 and 60 characters.' }
        }
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
        type: DataTypes.STRING(400), 
        allowNull: false,
        validate: {
            len: { args: [0, 400], msg: 'Address cannot exceed 400 characters.' }
        }
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