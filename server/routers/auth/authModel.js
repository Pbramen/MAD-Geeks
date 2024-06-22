// For more information, see documentation: ../../yamlDocs/authModel.yaml

const express = require('express');
const router = express.Router();
const { test1, createNewUser, isValidAuth } = require('./authController.js');
const verifyJWT  = require('../../middleware/verifyJWT.js');
const {handleRefreshToken} = require('./jwtController');
const { logOut } = require("./logoutController.js");


router.get('/', verifyJWT, test1);
router.post('/newUser', createNewUser);
router.post('/validateAuth', isValidAuth);
router.get('/refresh', handleRefreshToken);
// deletes refresh cookie and refresh token
router.delete('/logout', logOut);

module.exports = router;