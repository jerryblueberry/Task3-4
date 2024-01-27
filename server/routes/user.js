const express = require('express');
const { signInUser, signUpUser } = require('../controller/userController');

const router = express.Router();


router.route('/login').post(signInUser);
router.route('/signup').post(signUpUser);

module.exports = router;