// For more information, see documentation: ../../yamlDocs/authModel.yaml

const express = require('express');
const router = express.Router();
const path = require('path');
const { test1, createNewUser, isValidAuth } = require(path.resolve(__dirname, './authController.js'));
const {handleRefreshToken, verifyJWT} = require(path.resolve(__dirname,'./jwtController'));
const { logOut } = require(path.resolve(__dirname,'./logoutController.js'));
const { checkPassword, checkUsername, email, checkDOB} = require(path.resolve(__dirname,'../../mongoFunctions/validators/express-validators.js'));
const { validation } = require(path.resolve(__dirname,'../../middleware/validationResult.js'))


router.get('/', verifyJWT, test1);
router.post('/newUser', checkPassword(), checkUsername(), email(), checkDOB(), validation, createNewUser);
router.post('/validateAuth', checkPassword(), checkUsername(), validation, isValidAuth);
router.get('/refresh', handleRefreshToken);
// deletes refresh cookie and refresh token
router.delete('/logout', logOut);

module.exports = router;