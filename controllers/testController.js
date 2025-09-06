// controllers/testController.js
const TestModel = require('../models/testModel');
const { createResult } = require('../models/resultModel');
const { findFullQuestionDetails, updateHighestScore } = require('../models/testModel');

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

exports.addQuestionToTest = async (req, res, next) => {
    try {
        const { testId } = req.params;

        // --- MODIFICATION: Destructure 'imageUrl' from the request body ---
        const { question_text, options, correct_option, image_url } = req.body;
        console.log(req.body);

        if (!testId) {
            return res.status(400).json({ message: 'A valid Test ID must be provided in the URL.' });
        }

        // Create the data object to pass to the model
        const newQuestionData = {
            test_id: parseInt(testId, 10),
            question_text,
            options,
            correct_option,
            image_url, // <-- Pass the new imageUrl here
        };

        const newQuestion = await TestModel.addQuestion(newQuestionData);
        res.status(201).json({ message: 'Question added successfully!', question: newQuestion });

    } catch (err) {
        console.error('Error in addQuestionToTest controller:', err);
        next(err);
    }
};

exports.deleteQuestion = async (req, res, next) => {
    try {
        const questionId = req.params.id;
        const result = await TestModel.deleteQuestionById(questionId);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Question not found' });
        }

        res.status(200).json({ message: 'Question deleted successfully' });
    } catch (err) {
        next(err);
    }
};

exports.submitTest = async (req, res, next) => {
    const { testId, answers } = req.body;
    const userId = req.user.id;

    try {
        let score = 0;

        // Check answers in parallel
        await Promise.all(
            answers.map(async (answer) => {
                const question = await findFullQuestionDetails(answer.questionId);
                if (question && question.correct_option === answer.selectedOption) {
                    score += question.marks;
                }
            })
        );

        // Save result
        const result = await createResult({ userId, testId, score });

        // Update highest score
        await updateHighestScore(testId, score);

        res.status(201).json({
            message: 'Test submitted successfully!',
            score: result.score,
            resultId: result.id,
        });
    } catch (err) {
        next(err);
    }
};



exports.createTest = async (req, res, next) => {
    try {
        const {
            test_name,
            num_questions,
            duration_minutes,
            subject_topic,
            instructions,
            test_category,
            date_scheduled, // This can be null
        } = req.body;

        // Basic validation
        if (!test_name || !num_questions || !duration_minutes || !subject_topic) {
            return res.status(400).json({ message: 'Please provide all required fields.' });
        }

        const newTestData = {
            test_name,
            num_questions,
            duration_minutes,
            subject_topic,
            instructions,
            test_category,
            // Handle optional date: if it's not provided or is an empty string, set it to null
            date_scheduled: date_scheduled ? date_scheduled : null,
        };

        const newTest = await TestModel.create(newTestData);

        res.status(201).json({ message: 'Test created successfully!', test: newTest });

    } catch (err) {
        next(err);
    }
};


exports.updateQuestion = async (req, res, next) => {
    try {
        const questionId = req.params.id;
        const updatedData = req.body;
        // This correctly includes imageUrl

        const result = await TestModel.updateQuestionById(questionId, updatedData);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Question not found' });
        }

        res.json({ message: 'Question updated successfully', data: updatedData });
    } catch (err) {
        next(err);
    }
};


exports.uploadQuestionImage = (req, res) => {
    try {
        // The 'upload.single()' middleware has already run at this point.
        // If it failed, it would have thrown an error. If it succeeded,
        // the req.file object will be available.
        if (!req.file) {
            return res.status(400).json({ message: 'No file was uploaded.' });
        }

        // Log the successful upload details on the server
        console.log('File successfully uploaded to Cloudinary:', req.file);

        // Send a success response back to the client with the necessary data
        res.status(200).json({
            message: 'Image uploaded successfully',
            image_url: req.file.path,     // The secure URL from Cloudinary
            publicId: req.file.filename, // The public_id for future management
        });


    } catch (error) {
        // This will catch any unexpected errors during the process
        console.error('Error in upload controller:', error);
        res.status(500).json({ message: 'Error processing file upload.', error: error.message });
    }
};

exports.deleteQuestionImage = async (req, res, next) => {
    try {
        const questionId = req.params.id;

        // Call the new model function
        await TestModel.removeImageUrl(questionId);

        res.status(200).json({ message: 'Image successfully removed from question.' });
    } catch (err) {
        // This will catch the error if the questionId isn't found
        next(err);
    }
};