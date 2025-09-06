// routes/testRoutes.js
const express = require('express');
const {
    getAllTests,
    getDemoTests,
    getUpcomingTests,
    getTestById,
    getTestQuestions,
    submitTest,
    updateQuestion,
    deleteQuestion,
    createTest,
    addQuestionToTest,
    uploadQuestionImage,
    deleteQuestionImage
} = require('../controllers/testController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/Cloudinary.js');
const router = express.Router();

router.get('/tests', getAllTests);
router.get('/demo-tests', getDemoTests);
router.get('/upcoming-tests', getUpcomingTests);
router.get('/tests/:id', getTestById);
router.get('/tests/:id/questions', protect, getTestQuestions);
router.post('/tests/:id/submit', protect, submitTest);
router.put('/questions/:id', protect, updateQuestion);
router.delete('/questions/:id', protect, deleteQuestion);
router.post('/tests', createTest);
router.post('/tests/:testId/questions', addQuestionToTest);
router.post('/upload-image', protect, upload.single('questionImage'), uploadQuestionImage);
router.delete('/questions/:id/image', protect, deleteQuestionImage);


module.exports = router;