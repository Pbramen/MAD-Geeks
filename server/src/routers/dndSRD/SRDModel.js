const express = require('express');
const router = express.Router();
const path = require('path');
const { getResourceByClass } = require(path.resolve(__dirname, './SRDController.js'));

router.get('/levelResource/:class', getResourceByClass);

module.exports = router;