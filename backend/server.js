const dotenv = require('dotenv');
dotenv.config(); // Load environment variables first!

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');

// Database, Models, and Associations
const { sequelize, User } = require('./models/index'); 

// Middleware & Routes
const { errorHandler } = require('./middleware/errorHandler');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin'); // Must be created
const normalUserRoutes = require('./routes/normalUser'); // Must be created
const storeOwnerRoutes = require('./routes/storeOwner'); // Must be created

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes); // Enabled Admin Routes
app.use('/api/user', normalUserRoutes); // Enabled Normal User Routes
app.use('/api/owner', storeOwnerRoutes); // Enabled Store Owner Routes

// Simple Test Route
app.get('/api', (req, res) => {
    res.json({ message: 'Store Rating API is operational.' });
});

// Error Handler (MUST be last middleware before app.listen)
app.use(errorHandler); 

// Database sync and server start
sequelize.sync({ alter: true }).then(() => { 
    console.log('Database synced successfully.');
    
    // --- Initial Admin User Creation (Seed Block) ---
    (async () => {
        try {
            const adminEmail = 'admin@platform.com';
            const adminUser = await User.findOne({ where: { email: adminEmail } });
            
            if (!adminUser) {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash('Admin@123', salt);
                
                await User.create({
                    // Ensure name is long enough (>= 20 chars) to pass validation
                    name: 'Platform System Administrator Global Head of Ops', 
                    email: adminEmail,
                    password: hashedPassword,
                    address: 'Headquarters, Global Ops Center, Earth',
                    role: 'Admin',
                });
                console.log('Initial Admin user created: admin@platform.com / Admin@123');
            }
        } catch (error) {
            console.error('Error during Admin Seed Block:', error.message);
        }
    })();
    // --------------------------------------------------------

    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

}).catch(err => {
    console.error('Failed to sync database:', err);
});