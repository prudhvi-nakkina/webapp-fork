const express = require('express');

const { createUser, getUser, updateUser } = require('../controllers/usercontroller');
const { checkHealth, dummyCheckHealth } = require('../controllers/healthcontroller');
const { addProduct, deleteProduct, updateProduct, updateEntireProduct, getProduct } = require('../controllers/productcontroller');
const { uploadImage, getImage, getAllImages, deleteImage } = require('../controllers/uploadcontroller')
const upload = require('../middleware/multerfile')

const router = express.Router();

router
    .route('/healthz')
    .get(checkHealth);

router
    .route('/dummyhealth')
    .get(dummyCheckHealth)

router
    .route('/v1/user')
    .post(createUser);

router
    .route('/v1/user/:id')
    .get(getUser)
    .put(updateUser);

router
    .route('/v5/product')
    .post(addProduct);

router
    .route('/v1/product/:id')
    .delete(deleteProduct)
    .patch(updateProduct)
    .put(updateEntireProduct)
    .get(getProduct);

router.route('/v1/product/:id/image')
    .get(getAllImages)
    .post(upload.single('image'), uploadImage);

router.route('/v1/product/:pid/image/:id')
    .get(getImage)
    .delete(deleteImage)

module.exports = router;
