const express = require('express');

const { createUser, checkHealth, getUser } = require('../controllers/usercontroller');

const router = express.Router();

router
    .route('/healthz')
    .get(checkHealth);

router
    .route('/v1/user')
    .post(createUser);

router
    .route('/v1/user/:id')
    .get(getUser)
    .put();

module.exports = router;