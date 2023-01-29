const asyncHandler = require('../middleware/async');
const usermodel = require('../db/model');

// @desc    create new user
// @route   POST /api/v1/user
// @access  Private
exports.createUser = asyncHandler(async (req, res, next) => {

    const user = await usermodel.create(req.body);

    res.status(201).json({
        success: true,
        data: user
    });

});

// @desc    health check
// @route   GET /healthz
// @access  Private
exports.checkHealth = asyncHandler(async (req, res, next) => {

    res.status(200).json({
        success: true,
        data: null
    });

});