// routes/testRoutes.js
const express = require('express');
const {
    getAllTests,
    getDemoTests,
    getUpcomingTests,
    getTestById,
    getTestQuestions,
    submitTest,
} = require('../controllers/testController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/tests', getAllTests);
router.get('/demo-tests', getDemoTests);
router.get('/upcoming-tests', getUpcomingTests);
router.get('/tests/:id', getTestById);
router.get('/tests/:id/questions', protect, getTestQuestions);
router.post('/tests/:id/submit', protect, submitTest);

module.exports = router;