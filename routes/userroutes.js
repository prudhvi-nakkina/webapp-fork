const express = require('express');

const { createUser } = require('../controllers/usercontroller');

const router = express.Router();

router
    .route('/healthz')
    .get();

router
    .route('/v1/user')
    .post(createUser);

router
    .route('/v1/user/:id')
    .get()
    .put();

module.exports = router;