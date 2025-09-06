// models/resultModel.js
const db = require('../config/db');

const create = async ({ userId, testId, score }) => {
    const { rows } = await db.query(
        'INSERT INTO results (user_id, test_id, score) VALUES ($1, $2, $3) RETURNING *',
        [userId, testId, score]
    );
    return rows[0];
};

const findByUserId = async (userId) => {
    const { rows } = await db.query(
        `SELECT r.id, r.score, r.submitted_at,r.highest_score, t.test_name, t.num_questions
     FROM results r
     JOIN tests t ON r.test_id = t.id
     WHERE r.user_id = $1
     ORDER BY r.submitted_at DESC`,
        [userId]
    );
    return rows;
};

// Insert a new result
const createResult = async ({ userId, testId, score }) => {
    const query = `
    INSERT INTO results (user_id, test_id, score)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
    const { rows } = await db.query(query, [userId, testId, score]);
    return rows[0];
};


module.exports = { create, findByUserId, createResult };