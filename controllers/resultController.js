// controllers/resultController.js
const ResultModel = require('../models/resultModel');

exports.getUserResults = async (req, res, next) => {
    try {
        const results = await ResultModel.findByUserId(req.user.id);
        res.json(results);
    } catch (err) {
        next(err);
    }
};

