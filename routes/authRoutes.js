// routes/authRoutes.js
const express = require('express');
const { check, body } = require('express-validator');
const { registerUser, loginUser, getUserProfile, getAllUsers, assignTest, getBoughtTests } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// @route   POST /api/register
// @desc    Register a new user
router.post(
    '/register',
    [
        check('fullName', 'Full name is required').not().isEmpty(),
        check('email', 'Please include a valid email or phone').not().isEmpty(),
    ],
    registerUser
);

// @route   POST /api/login
// @desc    Authenticate user & get token
router.post(
    '/login',
    [
        check('email', 'Please include a valid email or phone').not().isEmpty(),
    ],
    loginUser
);

// @route   GET /api/user
// @desc    Get user data
router.get('/user', protect, getUserProfile);
router.get('/user/all', protect, getAllUsers);
router.post('/user/assigntest', protect, assignTest);
router.get("/user/mytests", protect, getBoughtTests);


module.exports = router;