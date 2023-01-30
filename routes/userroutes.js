const express = require('express');

const { createUser, checkHealth, getUser, updateUser } = require('../controllers/usercontroller');

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
    .put(updateUser);

module.exports = router;