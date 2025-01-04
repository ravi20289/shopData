const express = require("express");

const router = express.Router();

const authController = require('../controller/auth.controller');

router.route('/login').get(authController.getLogin);

module.exports = router;