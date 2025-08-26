// controllers/testController.js
const TestModel = require('../models/testModel');
const ResultModel = require('../models/resultModel');

exports.getAllTests = async (req, res, next) => {
    try {
        const tests = await TestModel.findAll();
        res.json(tests);
    } catch (err) {
        next(err);
    }
};

exports.getDemoTests = async (req, res, next) => {
    try {
        const demoTests = await TestModel.findDemos();
        res.json(demoTests);
    } catch (err) {
        next(err);
    }
};

exports.getUpcomingTests = async (req, res, next) => {
    try {
        const upcomingTests = await TestModel.findUpcoming();
        res.json(upcomingTests);
    } catch (err) {
        next(err);
    }
};

exports.getTestById = async (req, res, next) => {
    try {
        const test = await TestModel.findById(req.params.id);
        if (!test) {
            return res.status(404).json({ message: 'Test not found' });
        }
        res.json(test);
    } catch (err) {
        next(err);
    }
};

exports.getTestQuestions = async (req, res, next) => {
    try {
        const questions = await TestModel.findQuestionsByTestId(req.params.id);
        res.json(questions);
    } catch (err) {
        next(err);
    }
};

exports.submitTest = async (req, res, next) => {
    const { testId, answers } = req.body; // answers format: [{ questionId: 1, selectedOption: 'b' }, ...]
    const userId = req.user.id;

    try {
        let score = 0;
        // Use Promise.all for efficient parallel database lookups
        const questionChecks = answers.map(async (answer) => {
            const question = await TestModel.findFullQuestionDetails(answer.questionId);
            if (question && question.correct_option === answer.selectedOption) {
                score += question.marks;
            }
        });

        await Promise.all(questionChecks);

        const result = await ResultModel.create({ userId, testId, score });
        res.status(201).json({
            message: 'Test submitted successfully!',
            score: result.score,
            resultId: result.id,
        });
    } catch (err) {
        next(err);
    }
};