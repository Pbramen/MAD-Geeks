const express = require('express');
const router = express.Router();
const { test1, createNewUser } = require('./routerController.js');

router.get('/', test1)
router.post('/newUser', createNewUser)


module.exports = router;