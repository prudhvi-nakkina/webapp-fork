
const fs = require('fs');
const AWS = require('aws-sdk');
const { User, Product, Image } = require('../db/model');
const ErrorResponse = require('../util/errorResponse');
const bcrypt = require("bcrypt");

exports.uploadImage = async (req, res, next) => {

    try {

        let auth = req.headers.authorization;

        if (!auth) {
            return next(new ErrorResponse('User should provide authentication', 401));
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

                                        AWS.config.update({ region: 'us-east-1' });

                                        // Create S3 service object
                                        const s3 = new AWS.S3({ apiVersion: '2006-03-01' });

                                        const file = req.file;

                                        const reg = new RegExp("([a-zA-Z0-9\s_\\.\-:])+(.jpeg|.jpg|.png)$");

                                        if (reg.test(file.filename)) {

                                            const fileStream = fs.createReadStream(file.path)

                                            const uploadParams = {
                                                Bucket: process.env.S3,
                                                Body: fileStream,
                                                Key: file.filename
                                            }

                                            s3.upload(uploadParams).promise().then(result => {
                                                const image = {
                                                    ETag: result.ETag,
                                                    ServerSideEncryption: result.ServerSideEncryption,
                                                    VersionId: result.VersionId,
                                                    s3_bucket_path: result.Location,
                                                    file_name: result.Key,
                                                    product_id: req.params.id
                                                }
                                                const params = {
                                                    Bucket: result.Bucket,
                                                    Key: result.Key
                                                };

                                                s3.headObject(params, function (err, data) {
                                                    if (err) {
                                                        return next(err);
                                                    } else {
                                                        image.LastModified = String(data.LastModified)
                                                        image.ContentLength = data.ContentLength
                                                        image.ContentType = data.ContentType
                                                        image.product_id = req.params.id
                                                        image.date_created = new Date().toISOString()
                                                        Image.create(image).then(
                                                            i => {
                                                                res.status(201).json(
                                                                    {
                                                                        image_id: i.id,
                                                                        product_id: i.product_id,
                                                                        file_name: i.file_name,
                                                                        date_created: i.date_created,
                                                                        s3_bucket_path: i.s3_bucket_path
                                                                    }
                                                                );
                                                            }
                                                        ).catch(err => {
                                                            return next(err);
                                                        })
                                                    }
                                                });
                                            }).catch(err => {
                                                return next(err);
                                            });
                                        } else {
                                            return next(new ErrorResponse('the uploaded file is not an image', 400));
                                        }
                                    } else if (!p) {
                                        return next(new ErrorResponse('Product does not exists', 404));
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
                    return next(new ErrorResponse('User authentication failed', 401));
                })

            }
        ).catch(
            err => {
                return next(new ErrorResponse('User authentication failed', 401));
            }
        )

    } catch (err) {
        return next(new ErrorResponse('Error in product image upload, please try again later', 400));
    }

}

exports.getImage = async (req, res, next) => {

    try {

        let auth = req.headers.authorization;

        if (!auth) {
            return next(new ErrorResponse('User should provide authentication', 401));
        }

        let authorization = new Buffer.from(auth.split(' ')[1], 'base64').toString().split(':');

        const username = authorization[0];
        const password = authorization[1];

        User.findOne({ where: { username: username } }).then(
            user => {

                bcrypt.compare(password, user.password).then(
                    flag => {
                        if (flag) {
                            Product.findOne({ where: { id: req.params.pid } }).then(
                                p => {
                                    if (p && user.id == p.owner_user_id) {

                                        Image.findOne({ where: { id: req.params.id, product_id: req.params.pid } }).then(
                                            i => {
                                                const image = {
                                                    image_id: i.id,
                                                    product_id: i.product_id,
                                                    file_name: i.file_name,
                                                    date_created: i.date_created,
                                                    s3_bucket_path: i.s3_bucket_path
                                                }
                                                const arr = []
                                                arr.push(image);
                                                res.status(200).json(arr);
                                            }
                                        ).catch(err => {
                                            return next(new ErrorResponse('Image does not exist for given product', 404));
                                        })

                                    } else if (!p) {
                                        return next(new ErrorResponse('Product does not exists', 404));
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
                    return next(new ErrorResponse('User authentication failed', 401));
                })

            }
        ).catch(
            err => {
                return next(new ErrorResponse('User authentication failed', 401));
            }
        )

    } catch (err) {
        return next(new ErrorResponse('Error in product image upload, please try again later', 400));
    }
}

exports.getAllImages = async (req, res, next) => {
    try {

        let auth = req.headers.authorization;

        if (!auth) {
            return next(new ErrorResponse('User should provide authentication', 401));
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
                                        Image.findAll({ where: { product_id: req.params.id }, raw: true }).then(
                                            images => {
                                                const arr = []
                                                for (i of images) {
                                                    arr.push({
                                                        image_id: i.id,
                                                        product_id: i.product_id,
                                                        file_name: i.file_name,
                                                        date_created: i.date_created,
                                                        s3_bucket_path: i.s3_bucket_path
                                                    });
                                                }
                                                res.status(200).json(arr);
                                            }
                                        ).catch(err => {
                                            return next(new ErrorResponse('Image does not exists for given product', 404));
                                        });
                                    } else if (!p) {
                                        return next(new ErrorResponse('Product does not exists', 404));
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
                    return next(new ErrorResponse('User authentication failed', 401));
                })

            }
        ).catch(
            err => {
                return next(new ErrorResponse('User authentication failed', 401));
            }
        )

    } catch (err) {
        return next(new ErrorResponse('Error in product image upload, please try again later', 400));
    }
}

exports.deleteImage = async (req, res, next) => {
    try {

        let auth = req.headers.authorization;

        if (!auth) {
            return next(new ErrorResponse('User should provide authentication', 401));
        }

        let authorization = new Buffer.from(auth.split(' ')[1], 'base64').toString().split(':');

        const username = authorization[0];
        const password = authorization[1];

        User.findOne({ where: { username: username } }).then(
            user => {

                bcrypt.compare(password, user.password).then(
                    flag => {
                        if (flag) {
                            Product.findOne({ where: { id: req.params.pid } }).then(
                                p => {
                                    if (p && user.id == p.owner_user_id) {

                                        Image.findOne({ where: { id: req.params.id, product_id: req.params.pid } }).then(
                                            i => {
                                                const params = {
                                                    Bucket: process.env.S3,
                                                    Key: i.file_name
                                                }

                                                AWS.config.update({ region: 'us-east-1' });

                                                // Create S3 service object
                                                const s3 = new AWS.S3({ apiVersion: '2006-03-01' });

                                                s3.deleteObject(params).promise().then(result => {
                                                    Image.destroy({ where: { id: req.params.id } }).then(
                                                        r => {
                                                            res.status(204).json({
                                                                success: true
                                                            })
                                                        }).catch(err => {
                                                            return next(new ErrorResponse('Error in product deletion, please try again later', 400));
                                                        })
                                                }).catch(err => {
                                                    return next(new ErrorResponse('Error in deleting from bucket', 404));
                                                })
                                            }
                                        ).catch(err => {
                                            return next(new ErrorResponse('Image does not exist for given product', 404));
                                        })
                                    } else if (!p) {
                                        return next(new ErrorResponse('Product does not exists', 404));
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
                    return next(new ErrorResponse('User authentication failed', 401));
                })
            }
        ).catch(
            err => {
                return next(new ErrorResponse('User authentication failed', 401));
            }
        )
    } catch (err) {
        return next(new ErrorResponse('Error in product image upload, please try again later', 400));
    }
}