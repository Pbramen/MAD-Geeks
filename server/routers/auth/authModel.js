const express = require('express');
const router = express.Router();
const { test1, createNewUser, isValidAuth } = require('./authController.js');

router.get('/', test1);
router.post('/newUser', createNewUser);
router.post('/validateAuth', isValidAuth);


module.exports = router;