const express = require('express');
const router = express.Router();
const { test1, postUser } = require('./routerController.js');

router.get('/', test1)
router.post('/', postUser)

module.exports = router;