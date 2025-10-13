const errorHandler = (err, req, res, next) => {
    // 400 Bad Request for Sequelize validation errors
    if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
        res.status(400).json({ 
            message: "Database Validation Error",
            errors: err.errors.map(e => e.message)
        });
        return;
    }

    // Default status code is 500 (Internal Server Error)
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    
    // Response structure
    res.json({
        message: err.message || 'An unexpected server error occurred.',
        // Provide stack trace only in development environment
        stack: process.env.NODE_ENV === 'development' ? err.stack : null,
    });
};

module.exports = { errorHandler };