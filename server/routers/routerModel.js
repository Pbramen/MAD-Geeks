const express = require('express');
const router = express.Router();
const { test1 } = require('./routerController.js');

router.get('/', test1)

module.exports = router;