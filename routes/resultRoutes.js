// routes/resultRoutes.js
const express = require('express');
const { getUserResults } = require('../controllers/resultController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/results', protect, getUserResults);

module.exports = router;