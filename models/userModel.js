// models/userModel.js
const db = require('../config/db');

const findByEmail = async (email) => {
    const { rows } = await db.query('SELECT * FROM users WHERE email_or_phone = $1', [email]);
    return rows[0];
};

const create = async ({ fullName, email, school }) => {
    const { rows } = await db.query(
        'INSERT INTO users (full_name, email_or_phone, school_name) VALUES ($1, $2, $3) RETURNING id, full_name, email_or_phone, school_name',
        [fullName, email, school]
    );
    return rows[0];
};

const findById = async (id) => {
    const { rows } = await db.query('SELECT id, full_name, email_or_phone, school_name FROM users WHERE id = $1', [id]);
    return rows[0];
};
const findAll = async () => {
    const { rows } = await db.query(
        "SELECT id, full_name, email_or_phone, school_name FROM users"
    );
    return rows;
};



module.exports = { findByEmail, create, findById, findAll };