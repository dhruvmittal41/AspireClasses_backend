// controllers/authController.js
const { validationResult } = require('express-validator');
const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');

const generateToken = (user) => {
    return jwt.sign({ user: { id: user.id } }, process.env.JWT_SECRET, {
        expiresIn: '7d',
    });
};

exports.registerUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { fullName, email, school } = req.body;

    try {
        let user = await UserModel.findByEmail(email);
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }




        user = await UserModel.create({ fullName, email, school });

        const token = generateToken(user);
        res.status(201).json({ token });
    } catch (err) {
        next(err);
    }
};

exports.loginUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;


    try {
        const user = await UserModel.findByEmail(email);

        if (!user) {
            return res.status(400).json({ message: "Invalid Credentials" });

        }



        // We don't want to include the hashed password in the token payload
        const userPayload = await UserModel.findById(user.id);

        const token = generateToken(userPayload);
        res.json({
            token,
            user: {
                id: userPayload.id,
                full_name: userPayload.full_name // or whatever the column is named
            }
        });
    } catch (err) {
        next(err);
    }
};

exports.getUserProfile = async (req, res, next) => {
    try {
        // req.user is attached by the authMiddleware
        const user = await UserModel.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        next(err);
    }
};


// Using Sequelize User model
// adjust path

exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await UserModel.findAll({
            attributes: ["id", "username"] // only return these fields
        });
        res.json(users);
    } catch (err) {
        next(err);
    }
};


const assignTestToUser = async (userId, testId, isPaid) => {
    const { rows } = await db.query(
        `UPDATE users
         SET assigned_testid = $1,
             is_paid = $2
         WHERE id = $3
         RETURNING id, full_name, assigned_testid, is_paid`,
        [testId, isPaid, userId]
    );
    return rows[0]; // return updated user
};


exports.assignTest = async (req, res, next) => {
    try {
        const { userId, testId, isPaid } = req.body;

        if (!userId || !testId) {
            return res.status(400).json({ message: "User ID and Test ID are required" });
        }

        const updatedUser = await assignTestToUser(userId, testId, isPaid);

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found or update failed" });
        }

        res.json({ message: "Test assigned successfully", user: updatedUser });
    } catch (err) {
        next(err);
    }
};