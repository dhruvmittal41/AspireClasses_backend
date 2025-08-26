// middleware/errorMiddleware.js
const errorMiddleware = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Something went wrong on the server!',
        error: err.message, // Provide error message in development
    });
};

module.exports = errorMiddleware;