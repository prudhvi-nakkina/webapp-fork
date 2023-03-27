const asyncHandler = require('../middleware/async');
const { User } = require('../db/model');
const bcrypt = require("bcrypt");
const ErrorResponse = require('../util/errorResponse');
var logger = require('../middleware/logger');
const StatsD = require('hot-shots')
const client = new StatsD({
    host: 'localhost',
    port: 8125
});

// @desc    create new user
// @route   POST /v1/user
// @access  Private
exports.createUser = asyncHandler(async (req, res, next) => {

    client.increment('createUser-requests');

    // check if existing user, if email exists send 400
    if (!(req.body.first_name === null || req.body.username === null || req.body.last_name === null || req.body.password === null)) {
        User.findOne({ where: { username: req.body.username } }).then(
            user => {
                if (user) {
                    return next(new ErrorResponse('User already exists!', 400));
                } else {
                    let emailFormat = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
                    if (req.body.username !== '' && req.body.username.match(emailFormat)) {
                        bcrypt.genSalt(10, (err, salt) => {
                            bcrypt.hash(req.body.password, salt, async (err, hash) => {
                                req.body.password = hash;
                                const user = await User.create(req.body);

                                logger.info('POST /v1/user - user successfully created')

                                res.status(201).json({
                                    id: user.id,
                                    first_name: user.first_name,
                                    last_name: user.last_name,
                                    username: user.username,
                                    account_created: user.createdAt,
                                    account_updated: user.updatedAt
                                }
                                );
                                logger.info('POST /v1/user - user successfully created')
                            });
                        });
                    } else {
                        logger.error('POST /v1/user - invalid username')
                        return next(new ErrorResponse('username should be a valid email', 400));
                    }
                }
            }
        ).catch(
            err => {
                logger.error('POST /v1/user - error in fetching user from DB')
                return next(new ErrorResponse('Error in user creation, please re-check all the fields!', 400));
            }
        )
    } else {
        logger.error('POST /v1/user - error in input fields')
        return next(new ErrorResponse('Error in user creation, please re-check all the fields!', 400));
    }
});

// @desc    get user
// @route   GET /v1/user/:id
// @access  Private
exports.getUser = asyncHandler(async (req, res, next) => {

    client.increment('getUser-requests');

    let authenticateHeader = req.headers.authorization;

    if (!authenticateHeader) {
        return next(new ErrorResponse('User should provide authentication', 401));
    }

    let auth = new Buffer.from(authenticateHeader.split(' ')[1],
        'base64').toString().split(':');
    let username = auth[0];
    let password = auth[1];

    User.findOne({ where: { username: username } }).then(
        user => {
            if (user.id == req.params.id) {
                bcrypt.compare(password, user.password)
                    .then(flag => {
                        if (flag) {
                            User.findByPk(req.params.id).then(user => {

                                res.status(200).json({
                                    id: user.id,
                                    first_name: user.first_name,
                                    last_name: user.last_name,
                                    username: user.username,
                                    account_created: user.createdAt,
                                    account_updated: user.updatedAt
                                })
                                logger.info('GET /v1/user/:id - User fetched successfully')
                            })
                        } else {
                            logger.error('GET /v1/user/:id - User authentication failed, wrong password')
                            return next(new ErrorResponse('User authentication failed, wrong password', 401));
                        }
                    })
                    .catch(err => {
                        logger.error('GET /v1/user/:id - Error in bcrypt password validation')
                        return next(new ErrorResponse('User authentication failed, please try again later', 401));
                    }
                    )
            } else {
                logger.error('GET /v1/user/:id - Unauthorized access by user')
                return next(new ErrorResponse('User cannot access other user info', 403));
            }
        }
    ).catch(err => {
        logger.error('GET /v1/user/:id - Error in fetching user from DB')
        return next(new ErrorResponse('User authentication failed, please try again later', 401));
    });

})

// @desc    update user
// @route   PUT /v1/user/:id
// @access  Private
exports.updateUser = asyncHandler(async (req, res, next) => {

    client.increment('updateUser-requests');
    let authenticateHeader = req.headers.authorization;

    if (!authenticateHeader) {
        return next(new ErrorResponse('User should provide authentication', 401));
    }

    let auth = new Buffer.from(authenticateHeader.split(' ')[1],
        'base64').toString().split(':');
    let username = auth[0];
    let password = auth[1];

    User.findOne({ where: { username: username } }).then(
        user => {
            if (user.id == req.params.id) {
                if (!(req.body.first_name === null || req.body.last_name === null || req.body.password === null)) {
                    if (req.body.first_name || req.body.last_name || req.body.password) {
                        if ((req.body.username != null && username == req.body.username) || (req.body.username == null)) {
                            bcrypt.compare(password, user.password)
                                .then(flag => {
                                    if (flag) {
                                        bcrypt.genSalt(10, (err, salt) => {
                                            bcrypt.hash(req.body.password, salt, async (err, hash) => {
                                                req.body.password = hash;

                                                const rowsUpdated = await User.update(
                                                    req.body
                                                    , { returning: true, where: { id: req.params.id } }
                                                );

                                                if (rowsUpdated) {
                                                    res.status(204).json({
                                                        success: true
                                                    });
                                                    logger.info('PUT /v1/user/:id - successfully updated user')
                                                }
                                            });
                                        });
                                    } else {
                                        logger.error('PUT /v1/user/:id - failed attempt by user, wrong password')
                                        return next(new ErrorResponse('User authentication failed, wrong password', 401));
                                    }
                                }
                                ).catch(err => {
                                    logger.error('PUT /v1/user/:id - Error in bcrypt password validation')
                                    return next(new ErrorResponse('User authentication failed, please try again later', 401));
                                });
                        } else {
                            return next(new ErrorResponse('User cannot update username', 400));
                        }
                    } else {
                        return next(new ErrorResponse('User update failed, please re-check all the fields', 400));
                    }
                } else {
                    return next(new ErrorResponse('User update failed, please re-check all the fields', 400));
                }
            } else {
                return next(new ErrorResponse('User cannot access other user info', 403));
            }
        }).catch(err => {
            return next(new ErrorResponse('User authentication failed, please try again later', 401));
        });

});