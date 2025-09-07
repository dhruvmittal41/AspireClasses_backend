// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const testRoutes = require('./routes/testRoutes');
const resultRoutes = require('./routes/resultRoutes');
const errorMiddleware = require('./middleware/errorMiddleware');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const url = process.env.FRONTEND_URL;

const app = express();

// Middleware
app.use(cors({
    origin: url, // allow frontend dev server
    credentials: true, // if you need cookies/auth headers
}));
// Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse JSON bodies

// API Routes
app.use('/api', authRoutes);
app.use('/api', testRoutes);
app.use('/api', resultRoutes);


app.post('/api/admin/login', async (req, res) => {
    // Get username and password from the request body
    const { username, password } = req.body;

    // --- Basic Validation ---
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    // --- Retrieve Admin Credentials from Environment Variables ---
    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

    if (!adminUsername || !adminPasswordHash) {
        console.error("FATAL ERROR: Admin credentials are not set in the .env file.");
        return res.status(500).json({ message: "Server configuration error." });
    }

    try {
        // --- Authenticate the User ---
        // 1. Check if the username matches
        const isUsernameMatch = (username === adminUsername);

        // 2. Compare the provided password with the stored hash
        const isPasswordMatch = await bcrypt.compare(password, adminPasswordHash);

        // 3. If either does not match, send an error response
        if (!isUsernameMatch || !isPasswordMatch) {
            return res.status(401).json({ message: 'Invalid credentials. Please try again.' });
        }

        // --- Create a JWT if Authentication is Successful ---
        const payload = {
            user: {
                username: adminUsername,
                role: 'admin' // You can add other useful info here
            }
        };

        // Sign the token
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '8h' }, // Token will be valid for 8 hours
            (err, token) => {
                if (err) throw err;
                // Send the token back to the client
                res.json({ token });
            }
        );

    } catch (err) {
        console.error("Error during admin login:", err);
        res.status(500).json({ message: 'An internal server error occurred.' });
    }
});

// Global Error Handler
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));