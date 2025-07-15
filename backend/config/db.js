const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'login_app'
});

db.connect((err) => {
    if (err) {
        console.error('Database connection error:', err);
        console.log('Please make sure MySQL is running and the database exists.');
        console.log('You can create the database using the setup.sql file.');
        process.exit(1);
    }
    console.log('Connected to MySQL database');
});

module.exports = db;