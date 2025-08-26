// models/testModel.js
const db = require('../config/db');

const findAll = async () => {
    const { rows } = await db.query("SELECT * FROM tests WHERE test_category = 'standard'");
    return rows;
};

const findDemos = async () => {
    const { rows } = await db.query("SELECT * FROM tests WHERE test_category = 'demo'");
    return rows;
};

const findUpcoming = async () => {
    const { rows } = await db.query("SELECT * FROM tests WHERE test_category = 'upcoming'");
    return rows;
};

const findById = async (id) => {
    const { rows } = await db.query('SELECT * FROM tests WHERE id = $1', [id]);
    return rows[0];
};

const findQuestionsByTestId = async (testId) => {
    // Randomize question order directly in the DB query
    const { rows } = await db.query(
        'SELECT id, test_id, question_text, options, marks FROM questions WHERE test_id = $1 ORDER BY RANDOM()',
        [testId]
    );
    return rows;
};

// For answer checking during submission
const findFullQuestionDetails = async (questionId) => {
    const { rows } = await db.query('SELECT * FROM questions WHERE id = $1', [questionId]);
    return rows[0];
};


module.exports = { findAll, findDemos, findUpcoming, findById, findQuestionsByTestId, findFullQuestionDetails };