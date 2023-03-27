const ErrorResponse = require("../util/errorResponse");
var logger = require('../middleware/logger');

const errorHandler = (err, req, res, next) => {

    let error = { ...err }

    error.message = err.message;
    // Log to console for dev
    console.log(err.stack.red);

    logger.error(error.message)
    res.status(error.statusCode || 400).json({
        success: false,
        error: error.message || 'Server Error'
    });
};

module.exports = errorHandler;