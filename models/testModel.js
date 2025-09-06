// models/testModel.js
const db = require('../config/db');

const findAll = async () => {
    const { rows } = await db.query("SELECT * FROM tests");
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
        'SELECT id, test_id, question_text, options,correct_option,marks,image_url FROM questions WHERE test_id = $1 ORDER BY id',
        [testId]
    );
    return rows;
};

// For answer checking during submission
// Fetch full question details
const findFullQuestionDetails = async (questionId) => {
    const query = `SELECT * FROM questions WHERE id = $1`;
    const { rows } = await db.query(query, [questionId]);
    return rows[0];
};
// Update highest score for a test based on all results
const updateHighestScore = async (testId) => {
    const query = `
    UPDATE results r
    SET highest_score = sub.max_score
    FROM (
      SELECT test_id, MAX(score) AS max_score
      FROM results
      WHERE test_id = $1
      GROUP BY test_id
    ) sub
    WHERE r.test_id = sub.test_id
    RETURNING *;
  `;
    const { rows } = await db.query(query, [testId]);
    return rows; // all updated rows for that test_id
};


const updateQuestionById = (id, questionData) => {
    // --- MODIFICATION: Destructure 'imageUrl' from the incoming data ---
    const { question_text, options, correct_option, image_url } = questionData;

    const optionsString = JSON.stringify(options);

    // --- MODIFICATION: Add 'image_url' to the SET clause ---
    const sql = `
        UPDATE questions 
        SET question_text = $1, options = $2, correct_option = $3, image_url = $4
        WHERE id = $5
    `;

    // --- MODIFICATION: Add 'imageUrl' to the parameters array ---
    const params = [question_text, optionsString, correct_option, image_url, id];

    return new Promise((resolve, reject) => {
        db.query(sql, params, (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

// --- CORRECTED DELETE FUNCTION ---
const deleteQuestionById = (id) => {
    // FIX: Replaced ? with $1
    const sql = 'DELETE FROM questions WHERE id = $1';

    return new Promise((resolve, reject) => {
        db.query(sql, [id], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

const create = async (testData) => {
    const {
        test_name,
        num_questions,
        duration_minutes,
        subject_topic,
        instructions,
        test_category,
        date_scheduled,
    } = testData;

    const sql = `
        INSERT INTO tests 
            (test_name, num_questions, duration_minutes, subject_topic, instructions, test_category, date_scheduled) 
        VALUES 
            ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *; 
    `;

    const params = [
        test_name,
        num_questions,
        duration_minutes,
        subject_topic,
        instructions,
        test_category,
        date_scheduled,
    ];

    const { rows } = await db.query(sql, params);
    return rows[0];
};

const addQuestion = async (questionData) => {
    // 1. Destructure 'imageUrl' from the incoming questionData object
    const { test_id, question_text, options, correct_option, image_url } = questionData;
    const optionsString = JSON.stringify(options);

    // 2. Add the 'image_url' column to the SQL INSERT statement and a new placeholder ($5)
    const sql = `
        INSERT INTO questions (test_id, question_text, options, correct_option, image_url) 
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
    `;

    // 3. Add the 'imageUrl' variable to the parameters array.
    //    Using '|| null' is a safeguard to insert NULL if imageUrl is undefined or an empty string.
    const params = [test_id, question_text, optionsString, correct_option, image_url || null];

    // Execute the query with the new parameters
    const { rows } = await db.query(sql, params);

    // Return the complete new question row from the database
    return rows[0];
};


const removeImageUrl = async (questionId) => {
    const sql = `
        UPDATE questions
        SET image_url = NULL
        WHERE id = $1
        RETURNING id; 
    `;

    console.log("Attempting to remove image URL for questionId:", questionId);

    // 1. Await the database query directly, just like in addQuestion
    //    We destructure both 'rows' (from RETURNING) and 'rowCount'
    const { rows, rowCount } = await db.query(sql, [questionId]);

    // 2. Check rowCount to verify an update happened (mimics your original check)
    if (rowCount === 0) {
        // Instead of rejecting a promise, we throw an error.
        // This will be caught by the .catch() or try/catch block of whatever function calls removeImageUrl.
        throw new Error('Question not found.');
    }

    // 3. Return the data from 'rows[0]' (which is { id: ... }), just like addQuestion returns rows[0].
    return rows[0];
};


module.exports = {
    findAll,
    findDemos,
    findUpcoming,
    findById,
    findQuestionsByTestId,
    findFullQuestionDetails,
    updateHighestScore,
    updateQuestionById,
    deleteQuestionById,
    create,
    addQuestion,
    removeImageUrl
};