const express = require("express");

const router = express.Router();

const authController = require('../controller/authController');

router.post('/register', authController.createUser);

router.get('/register-user', authController.getUser);

router.post('/login', authController.userLogin);

router.post('/forgot-password', authController.sendMail);

router.post('/reset-password', authController.resetPassword);


module.exports = router;