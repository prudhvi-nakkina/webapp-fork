const express = require('express');

const { createUser, getUser, updateUser } = require('../controllers/usercontroller');
const { checkHealth } = require('../controllers/healthcontroller');
const { addProduct, deleteProduct, updateProduct, updateEntireProduct, getProduct } = require('../controllers/productcontroller');
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

router
    .route('/v1/product')
    .post(addProduct);

router
    .route('/v1/product/:id')
    .delete(deleteProduct)
    .patch(updateProduct)
    .put(updateEntireProduct)
    .get(getProduct);

module.exports = router;