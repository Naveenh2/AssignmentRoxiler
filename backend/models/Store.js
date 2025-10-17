const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Store = sequelize.define('Store', {
    id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true,
        autoIncrement: true
    },
    name: { 
        type: DataTypes.STRING(100), 
        allowNull: false,
        validate: {
            len: { args: [1, 100], msg: 'Store name must be between 1 and 100 characters.' }
        }
    },
    email: { 
        type: DataTypes.STRING(255), 
        allowNull: false, 
        unique: true,
        validate: { isEmail: { msg: 'Invalid store email format.' } }
    },
    address: { 
        type: DataTypes.STRING(400), 
        allowNull: false,
        validate: { len: { args: [0, 400], msg: 'Address cannot exceed 400 characters.' } }
    },
    // The 'ownerId' field is defined via the association in index.js
}, {
    // Other model options
});

module.exports = Store;