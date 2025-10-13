const sequelize = require('../config/database');
const User = require('./User');
const Store = require('./Store');
const Rating = require('./Rating');

// --- Define Associations ---

// 1. StoreOwner to Store (One-to-One)
// Links StoreOwner User (Owner) to the Store they manage.
User.hasOne(Store, { 
    foreignKey: 'ownerId', 
    as: 'OwnedStore',
    onDelete: 'CASCADE' // If owner user is deleted, delete the store.
});
Store.belongsTo(User, { 
    foreignKey: 'ownerId', 
    as: 'Owner' 
});

// 2. User to Rating (One-to-Many)
// A user can submit many ratings.
User.hasMany(Rating);
Rating.belongsTo(User);

// 3. Store to Rating (One-to-Many)
// A store can receive many ratings.
Store.hasMany(Rating);
Rating.belongsTo(Store);

// NOTE: The composite unique constraint (unique user-store rating)
// has been moved to the 'indexes' option inside the Rating.js file,
// fixing the "addConstraint is not a function" error.

// Export all models and the sequelize instance for use in server.js
module.exports = { 
    sequelize, 
    User, 
    Store, 
    Rating 
};