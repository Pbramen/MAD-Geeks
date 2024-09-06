const express = require('express');
const router = express.Router();
const path = require('path');
const { getProficiencyChoices, getStartingEquipment } = require(path.resolve(__dirname, './SRDController.js'));

router.get('/levelResource/:class', getProficiencyChoices);
router.get('/levelResource/equipment/:class', getStartingEquipment);


module.exports = router;