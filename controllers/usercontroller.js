const asyncHandler = require('../middleware/async');
const usermodel = require('../db/model');
const bcrypt = require("bcrypt");
const ErrorResponse = require('../util/errorResponse');

// @desc    create new user
// @route   POST /v1/user
// @access  Private
exports.createUser = asyncHandler(async (req, res, next) => {

    // check if existing user, if email exists send 400
    usermodel.findOne({ where: { username: req.body.username } }).then(
        user => {
            if (user) {
                return next(new ErrorResponse('User already exists!', 400));
            } else {
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(req.body.password, salt, async (err, hash) => {
                        req.body.password = hash;
                        const user = await usermodel.create(req.body);

                        res.status(201).json({
                            success: true,
                            data: {
                                id: user.id,
                                first_name: user.first_name,
                                last_name: user.last_name,
                                username: user.username,
                                account_created: user.createdAt,
                                account_updated: user.updatedAt
                            }
                        });
                    });
                });
            }
        }
    ).catch(err => {
        return next(new ErrorResponse('Error in user creation!', 400));
    })
});

// @desc    health check
// @route   GET /healthz
// @access  Private
exports.checkHealth = asyncHandler((req, res, next) => {

    res.status(200).json({
        success: true,
        data: null
    });

});

// @desc    get user
// @route   GET /v1/user/:id
// @access  Private
exports.getUser = asyncHandler(async (req, res, next) => {

    let authenticateHeader = req.headers.authorization;

    if (!authenticateHeader) {
        return next(new ErrorResponse('User should provide authentication', 400));
    }

    let auth = new Buffer.from(authenticateHeader.split(' ')[1],
        'base64').toString().split(':');
    let username = auth[0];
    let password = auth[1];

    usermodel.findOne({ where: { username: username } }).then(
        user => {
            if (user.id == req.params.id) {
                bcrypt.compare(password, user.password)
                    .then(flag => {
                        if (flag) {
                            usermodel.findByPk(req.params.id).then(user => {

                                res.status(200).json({
                                    success: true,
                                    data: {
                                        id: user.id,
                                        first_name: user.first_name,
                                        last_name: user.last_name,
                                        username: user.username,
                                        account_created: user.createdAt,
                                        account_updated: user.updatedAt
                                    }
                                })
                            })
                        } else {
                            return next(new ErrorResponse('User  authentication failed', 400));
                        }
                    })
                    .catch(err => {
                        return next(new ErrorResponse('User password matching failed', 400));
                    }
                    )
            } else {
                return next(new ErrorResponse('User cannot access other user info', 400));
            }
        }
    ).catch(err => {
        return next(new ErrorResponse('auth creds dont exist in DB', 400));
    });

})

// @desc    update user
// @route   PUT /v1/user/:id
// @access  Private
exports.updateUser = asyncHandler(async (req, res, next) => {
    let authenticateHeader = req.headers.authorization;

    if (!authenticateHeader) {
        return next(new ErrorResponse('User should provide authentication', 400));
    }

    let auth = new Buffer.from(authenticateHeader.split(' ')[1],
        'base64').toString().split(':');
    let username = auth[0];
    let password = auth[1];

    usermodel.findOne({ where: { username: username } }).then(
        user => {
            if (user.id == req.params.id) {
                if (username == req.body.username) {
                    bcrypt.compare(password, user.password)
                        .then(flag => {
                            if (flag) {
                                bcrypt.genSalt(10, (err, salt) => {
                                    bcrypt.hash(req.body.password, salt, async (err, hash) => {
                                        req.body.password = hash;

                                        const rowsUpdated = await usermodel.update(
                                            {
                                                first_name: req.body.first_name,
                                                last_name: req.body.last_name,
                                                password: req.body.password
                                            }, { returning: true, where: { id: req.params.id } }
                                        );

                                        if (rowsUpdated) {
                                            res.status(204).json({
                                                success: true
                                            });
                                        }
                                    });
                                });
                            } else {
                                return next(new ErrorResponse('User  authentication failed', 400));
                            }
                        }
                        ).catch(err => {
                            return next(new ErrorResponse('User password matching failed', 400));
                        });
                } else {
                    return next(new ErrorResponse('User cannot update username', 400));
                }
            } else {
                return next(new ErrorResponse('User cannot access other user info', 400));
            }
        }).catch(err => {
            return next(new ErrorResponse('auth creds dont exist in DB', 400));
        });

});