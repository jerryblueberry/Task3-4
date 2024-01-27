const express = require('express');

const { addProducts, getProducts, deleteProduct, getStock, updateProduct, patchProducts, getProductById}  = require('../controller/productController');

const router  = express.Router();





router.route('/').post(addProducts);
router.route('/get').get(getProducts);
router.route('/get/id/:productId').get(getProductById);
router.route('/delete/:productId').delete(deleteProduct);
router.route('/stock').get(getStock);
router.route('/update/:productId').put(updateProduct);
router.route('/patch/:productId').patch(patchProducts);

module.exports  = router;