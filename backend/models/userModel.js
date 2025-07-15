const db = require('../config/db');

const createUser = (user) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO users (username, email, password, google_id) VALUES (?, ?, ?, ?)';
        db.query(sql, [user.username, user.email, user.password, user.googleId || null], (error, results) => {
            if (error) {
                reject(error);
            } else {
                // Get the created user with the ID
                findUserById(results.insertId)
                    .then(user => resolve(user))
                    .catch(err => reject(err));
            }
        });
    });
};

const findUserByEmail = (email) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM users WHERE email = ?';
        db.query(sql, [email], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results[0]); // Return the first user found
            }
        });
    });
};

const findUserById = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM users WHERE id = ?';
        db.query(sql, [id], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results[0]); // Return the first user found
            }
        });
    });
};

const updateUser = (id, updateData) => {
    return new Promise((resolve, reject) => {
        const fields = Object.keys(updateData).map(key => `${key} = ?`).join(', ');
        const values = Object.values(updateData);
        values.push(id);
        
        const sql = `UPDATE users SET ${fields} WHERE id = ?`;
        db.query(sql, values, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
};

const findUserByGoogleId = (googleId) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM users WHERE google_id = ?';
        db.query(sql, [googleId], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results[0]); // Return the first user found
            }
        });
    });
};

module.exports = {
    createUser,
    findUserByEmail,
    findUserById,
    updateUser,
    findUserByGoogleId
};