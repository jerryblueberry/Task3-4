const express = require('express');
const { addCart } = require('../controller/cartController');

const router = express.Router();

router.route('/').post(addCart);


module.exports = router;