// models/UserModel.js
const db = require('../middleware/db');

class UserModel {
    static async findByEmail(email) {
        const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        return result.rows[0];
    }

    static async create({
        email, passwordHash, fName, lName,
        height, weight, gender, type, phoneNum, status
    }) {
        const result = await db.query(`
            INSERT INTO users (
                email, passwordHash, fName, lName,
                height, weight, gender, type, phoneNum, status
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING id, email, fName, lName
        `, [email, passwordHash, fName, lName, height, weight, gender, type, phoneNum, status]);

        return result.rows[0];
    }
}

module.exports = UserModel;
