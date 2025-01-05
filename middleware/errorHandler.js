const AppError = require('../utils/appError'); // Import your custom AppError class

module.exports = (err, req, res, next) => {
    // Default error values
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    // Send the error response
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message || 'Internal Server Error',
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined, // Include stack trace only in development
    });
};
