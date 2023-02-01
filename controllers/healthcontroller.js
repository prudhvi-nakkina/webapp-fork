const asyncHandler = require('../middleware/async');

// @desc    health check
// @route   GET /healthz
// @access  Private
exports.checkHealth = asyncHandler((req, res, next) => {

    res.status(200).json({
        success: true,
        data: "Health Check Successful"
    });

});