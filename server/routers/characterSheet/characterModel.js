const express = require('express');
const router = express.Router();
const { createNewSheet, updateClassResource } = require('./characterController.js');

router.post('/create_new_sheet', createNewSheet)
router.post('/update_class_resource', updateClassResource);

module.exports = router;