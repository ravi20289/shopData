const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_DATABASE, 
    process.env.DB_USERNAME, 
    process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false, 
    pool: {
        max: 5, 
        min: 0, 
        acquire: 30000, 
        idle: 10000, 
    },
});

// Test the connection
sequelize.authenticate()
    .then(() => console.log('Database connected successfully!'))
    .catch((error) => console.error('Unable to connect to the database:', error));

module.exports = sequelize;
