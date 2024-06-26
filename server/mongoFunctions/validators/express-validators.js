const { body, cookie,  validationResults } = require("express-validator");
const { userModel } = require("../schemas/client_Schema")
const { _passwordHelper } = require('../validators/validateFunctions');

const paths = userModel.schema.paths;

const userMin = paths['userLogin'].options.minLength[0];
const userMax = paths['userLogin'].options.maxLength[0];
const passwordConfig = {
    minLength: paths['password'].options.minLength[0],
    minLowercase: 1, 
    maxLowercase: 1,
    minNumbers: 1,
    minSymbols: 1
}


// decorator function for express-validator.
function expressCheckPassword(value) {
    console.log("Attempting to validate password...")
    const errs = _passwordHelper(value);
    if (errs.length !== 0)
        return false;
    return true;
}

const checkBlackList = (value, blacklist) => {
    const n = value.length;
    var i = 0;
    var errors = []
    for (i = 0; i < n; i++) {
        if (value[i] in blacklist) {
            errors.push( {[value[i]]: index} )
        }
    } 
    return errors;
}

const checkUsername = () => {
    return body('username')
        .notEmpty().withMessage("Username is required").bail()
        .blacklist('&. ').withMessage()
        .isLength({ min: userMin, max: userMax }).withMessage(`Out of range: ${userMin}-${userMax}`);
}

const checkPassword = () => {
    // console.log("checking password...")
    return body('password')
        .notEmpty().withMessage("Password is required.").bail()
        .isStrongPassword().withMessage((value) => {
            const err = _passwordHelper(value);
            return err;
        });
}



module.exports = {checkUsername, checkPassword}