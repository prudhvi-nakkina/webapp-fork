const { User, Product } = require('../db/model');
const ErrorResponse = require('../util/errorResponse');
const bcrypt = require("bcrypt");

// @desc    add new product
// @route   POST /v1/product
// @access  Private

exports.addProduct = async (req, res, next) => {
    try {
        if ((!(req.body.name === null || req.body.description === null || req.body.sku === null || req.body.manufacturer === null || req.body.quantity === null)) && (req.body.quantity && typeof (req.body.quantity) === "number")) {
            if (req.body.name && req.body.description && req.body.sku && req.body.manufacturer && req.body.quantity) {
                let auths = req.headers.authorization;

                if (!auths) {
                    return next(new ErrorResponse('User should provide authentication', 400));
                }

                let auth = new Buffer.from(auths.split(' ')[1], 'base64').toString().split(':');
                let username = auth[0];
                let password = auth[1];

                User.findOne({ where: { username: username } }).then(
                    user => {
                        bcrypt.compare(password, user.password).then(
                            flag => {
                                if (flag) {
                                    req.body.owner_user_id = user.id;
                                    req.body.date_added = new Date().toLocaleString();
                                    req.body.date_last_updated = new Date().toLocaleString();
                                    Product.create(req.body).then(
                                        product => {
                                            res.status(201).json(product);
                                        }
                                    ).catch(err => {
                                        return next(err);
                                    })
                                } else {
                                    return next(new ErrorResponse('User authentication failed, wrong password', 401));
                                }
                            }
                        )
                    }
                ).catch(err => {
                    return next(new ErrorResponse('failed to add product, please try again later', 400));
                })
            } else {
                return next(new ErrorResponse('failed to add product, please re-check all the fields!', 400));
            }

        } else {
            return next(new ErrorResponse('failed to add product, please re-check all the fields!', 400));
        }

    }

    catch (err) {
        return next(new ErrorResponse('failed to add product, please try again later', 400));
    }
}

// @desc    delete product
// @route   DELETE /v1/product/:id
// @access  Private

exports.deleteProduct = async (req, res, next) => {
    try {
        let auth = req.headers.authorization;

        if (!auth) {
            return next(new ErrorResponse('User should provide authentication', 400));
        }

        let authorization = new Buffer.from(auth.split(' ')[1], 'base64').toString().split(':');

        const username = authorization[0];
        const password = authorization[1];

        User.findOne({ where: { username: username } }).then(
            user => {

                bcrypt.compare(password, user.password).then(
                    flag => {
                        if (flag) {
                            Product.findOne({ where: { id: req.params.id } }).then(
                                p => {
                                    if (p && user.id == p.owner_user_id) {
                                        Product.destroy({ where: { id: req.params.id } }).then(
                                            r => {
                                                res.status(204).json({
                                                    success: true
                                                })
                                            }).catch(err => {
                                                return next(new ErrorResponse('Error in product deletion, please try again later', 400));
                                            })
                                    } else {
                                        return next(new ErrorResponse('User cannot access other user product', 403));
                                    }
                                }
                            ).catch(err => {
                                return next(new ErrorResponse('Product does not exists', 404));
                            });
                        } else {
                            return next(new ErrorResponse('User authentication failed, wrong password', 401));
                        }
                    }
                ).catch(err => {
                    return next(new ErrorResponse('User authentication failed', 400));
                })

            }
        ).catch(
            err => {
                return next(new ErrorResponse('User authentication failed', 400));
            }
        )

    }
    catch (err) {
        return next(new ErrorResponse('Error in product deletion, please try again later', 400));
    }
}

exports.updateProduct = async (req, res, next) => {
    try {

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
                if (!(req.body.name === null || req.body.description === null || req.body.sku === null || req.body.manufacturer === null || req.body.quantity === null)) {
                    if (req.body.name || req.body.description || req.body.sku || req.body.manufacturer || req.body.quantity) {
                        if (!(req.body.date_added || req.body.date_last_updated || req.body.owner_user_id)) {
                            bcrypt.compare(password, user.password).then(
                                flag => {
                                    if (flag) {
                                        Product.findOne({ where: { id: req.params.id } }).then(
                                            p => {
                                                if (p && user.id == p.owner_user_id) {
                                                    if ((req.body.owner_user_id && p.owner_user_id !== req.body.owner_user_id) || !req.body.owner_user_id) {
                                                        const pro = {
                                                            ...(req.body.name) && { name: req.body.name },
                                                            ...(req.body.description) && { description: req.body.description },
                                                            ...(req.body.sku) && { sku: req.body.sku },
                                                            ...(req.body.manufacturer) && { manufacturer: req.body.manufacturer },
                                                            ...(req.body.quantity && typeof (req.body.quantity) === 'number') && { quantity: req.body.quantity }
                                                        }
                                                        pro.date_last_updated = new Date().toLocaleString();
                                                        if (req.body.quantity != undefined && typeof (req.body.quantity) !== 'number') {
                                                            return next(new ErrorResponse('Quantity should be a number', 400));
                                                        }
                                                        Product.update(
                                                            pro
                                                            , { returning: true, where: { id: req.params.id } }
                                                        ).then(
                                                            rows => {

                                                                if (rows) {
                                                                    res.status(204).json({
                                                                        success: true
                                                                    });
                                                                }
                                                            }
                                                        ).catch(err => {
                                                            return next(new ErrorResponse('Error in updating product, please try again later', 400));
                                                        })
                                                    } else {
                                                        return next(new ErrorResponse('User cannot update owner id', 403));
                                                    }

                                                } else {
                                                    return next(new ErrorResponse('User cannot access other user product', 403));
                                                }
                                            }
                                        ).catch(err => {
                                            return next(new ErrorResponse('Product does not exists', 404));
                                        });
                                    } else {
                                        return next(new ErrorResponse('User authentication failed, wrong password', 401));
                                    }
                                }
                            ).catch(err => {
                                return next(new ErrorResponse('User authentication failed', 400));
                            })
                        } else {
                            return next(new ErrorResponse('Product update failed, invalid fields!', 400));
                        }
                    } else {
                        return next(new ErrorResponse('Product update failed, please re-check all the fields', 400));
                    }
                } else {
                    return next(new ErrorResponse('Product update failed, please re-check all the fields', 400));
                }
            }).catch(err => {
                return next(new ErrorResponse('User authentication failed, please try again later', 401));
            });

    }

    catch (err) {

        return next(new ErrorResponse('Error in updating product, please try again later', 400));

    }
}

exports.updateEntireProduct = async (req, res, next) => {
    try {

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
                if (!(req.body.name === null || req.body.description === null || req.body.sku === null || req.body.manufacturer === null || req.body.quantity === null) && (typeof (req.body.quantity) === "number")) {
                    if (req.body.name && req.body.description && req.body.sku && req.body.manufacturer && req.body.quantity) {
                        if (!(req.body.date_added || req.body.date_last_updated || req.body.owner_user_id)) {
                            bcrypt.compare(password, user.password).then(
                                flag => {
                                    if (flag) {
                                        Product.findOne({ where: { id: req.params.id } }).then(
                                            p => {
                                                if (p && user.id == p.owner_user_id) {
                                                    if ((req.body.owner_user_id && p.owner_user_id !== req.body.owner_user_id) || !req.body.owner_user_id) {
                                                        req.body.date_last_updated = new Date().toLocaleString();
                                                        Product.update(
                                                            req.body
                                                            , { returning: true, where: { id: req.params.id } }
                                                        ).then(
                                                            rows => {

                                                                if (rows) {
                                                                    res.status(204).json({
                                                                        success: true
                                                                    });
                                                                }
                                                            }
                                                        ).catch(err => {
                                                            return next(new ErrorResponse('Error in updating product, please try again later', 400));
                                                        })
                                                    } else {
                                                        return next(new ErrorResponse('User cannot update owner id', 403));
                                                    }

                                                } else {
                                                    return next(new ErrorResponse('User cannot access other user product', 403));
                                                }
                                            }
                                        ).catch(err => {
                                            return next(new ErrorResponse('Product does not exists', 404));
                                        });
                                    } else {
                                        return next(new ErrorResponse('User authentication failed, wrong password', 401));
                                    }
                                }
                            ).catch(err => {
                                return next(new ErrorResponse('User authentication failed', 400));
                            })
                        } else {
                            return next(new ErrorResponse('Product update failed, invalid fields!', 400));
                        }
                    } else {
                        return next(new ErrorResponse('Product update failed, please re-check all the fields', 400));
                    }
                } else {
                    return next(new ErrorResponse('Product update failed, please re-check all the fields', 400));
                }
            }).catch(err => {
                return next(new ErrorResponse('User authentication failed, please try again later', 401));
            });

    }

    catch (err) {

        return next(new ErrorResponse('Error in updating product, please try again later', 400));

    }
}

exports.getProduct = async (req, res, next) => {

    try {

        let auth = req.headers.authorization;

        if (!auth) {
            return next(new ErrorResponse('User should provide authentication', 400));
        }

        let authorization = new Buffer.from(auth.split(' ')[1], 'base64').toString().split(':');

        const username = authorization[0];
        const password = authorization[1];

        User.findOne({ where: { username: username } }).then(
            user => {
                bcrypt.compare(password, user.password).then(
                    flag => {
                        if (flag) {
                            Product.findOne({ where: { id: req.params.id } }).then(
                                p => {
                                    if (p && user.id == p.owner_user_id) {
                                        res.status(200).json(p);
                                    }
                                    else {
                                        return next(new ErrorResponse('User cannot access other user product', 403));
                                    }
                                }
                            ).catch(err => {
                                return next(new ErrorResponse('Product does not exists', 404));
                            });
                        } else {
                            return next(new ErrorResponse('User authentication failed, wrong password', 401));
                        }
                    }
                ).catch(err => {
                    return next(new ErrorResponse('User authentication failed', 400));
                })

            }
        ).catch(
            err => {
                return next(new ErrorResponse('User authentication failed', 400));
            }
        )

    }

    catch (err) {
        return next(new ErrorResponse('Error in getting product, please try again later', 400));
    }

}

