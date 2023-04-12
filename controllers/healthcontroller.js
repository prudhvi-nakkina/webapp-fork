const asyncHandler = require('../middleware/async');
const StatsD = require('hot-shots')
var logger = require('../middleware/logger');
const AWS = require('aws-sdk');
// @desc    health check
// @route   GET /healthz
// @access  Private
exports.checkHealth = asyncHandler((req, res, next) => {

    const client = new StatsD({
        host: 'localhost',
        port: 8125
    });

    client.increment('healthz-requests');

    res.status(200).json({
        success: true,
        data: "Health Check Successful"
    });
    logger.info('Health Check Successful');
});

exports.dummyCheckHealth = asyncHandler((req, res, next) => {

    const client = new StatsD({
        host: 'localhost',
        port: 8125
    });

    client.increment('dummy-healthz-requests');

    res.status(200).json({
        success: true,
        data: "Dummy Health Check Successful"
    });
    logger.info('Dummy Health Check Successful');
});