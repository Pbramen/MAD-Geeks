const express = require('express');
const router = express.Router();

router.get('/', test1)
router.post('/create_new_sheet', createNewSheet)
router.post('/update_class_resource', updateClassResource);

module.exports = router;