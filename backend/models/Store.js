const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Store = sequelize.define('Store', {
    id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true,
        autoIncrement: true
    },
    name: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    email: { 
        type: DataTypes.STRING, 
        allowNull: false, 
        unique: true,
        validate: { isEmail: true }
    },
    address: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    // The 'ownerId' field is defined via the association in index.js
}, {
    // Other model options
});

module.exports = Store;