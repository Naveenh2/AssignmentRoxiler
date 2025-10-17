require('dotenv').config();
const { User, sequelize } = require('../models/index');

const listUsers = async () => {
  try {
    await sequelize.authenticate();
    console.log('DB connected');

    const users = await User.findAll({ attributes: ['id', 'name', 'email', 'role', 'createdAt'] });
    console.log('Users:');
    users.forEach(u => console.log(u.toJSON()));

    await sequelize.close();
  } catch (err) {
    console.error('Error listing users:', err.message || err);
    process.exit(1);
  }
};

listUsers();
