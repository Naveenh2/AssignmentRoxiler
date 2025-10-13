const axios = require('axios');
const Transaction = require('../models/Transaction');

const EXTERNAL_API_URL = "https://s3.amazonaws.com/roxiler.com/product_transaction.json";

const seedDatabase = async () => {
    try {
        const count = await Transaction.count();
        if (count > 0) {
            console.log('Database already seeded with transactions.');
            return;
        }

        console.log('Fetching initial data from external API...');
        const response = await axios.get(EXTERNAL_API_URL);
        const data = response.data;

        // Map data to ensure it fits the model structure
        const transactions = data.map(item => ({
            ...item,
            // Ensure data types are correct before insertion
            dateOfSale: item.dateOfSale ? new Date(item.dateOfSale) : null,
            sold: item.sold === true || item.sold === 1, // Handle potential boolean variations
        }));
        
        await Transaction.bulkCreate(transactions);
        console.log(`Database seeded successfully with ${transactions.length} transactions.`);

    } catch (error) {
        console.error('Error seeding database:', error.message);
    }
};

module.exports = { seedDatabase };