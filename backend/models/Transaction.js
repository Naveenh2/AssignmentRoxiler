const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Transaction = sequelize.define('Transaction', {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    title: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.FLOAT, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    category: { type: DataTypes.STRING, allowNull: false },
    image: { type: DataTypes.STRING, allowNull: true },
    sold: { type: DataTypes.BOOLEAN, allowNull: false }, // TRUE/FALSE
    dateOfSale: { type: DataTypes.DATE, allowNull: false },
}, {
    timestamps: false
});

module.exports = Transaction;