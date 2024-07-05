const { body } = require("express-validator");
const path = require("path")
const { userModel } = require(path.resolve(__dirname, "../schemas/client_Schema"));
const { _passwordHelper } = require(path.resolve(__dirname, '../validators/validateFunctions'));

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

const isJson = () => {
    return body().isJSON().withMessage("Must send valid json data").bail();
}

const checkUsername = () => {
    return body('username')
        .trim().notEmpty().withMessage("Username is required").bail()
        .isLength({ min: userMin, max: userMax }).withMessage(`Out of range: ${userMin}-${userMax}`)
        .matches(/[^$. ]/).withMessage("Username cannot contain '$', '.', or ' '")
}

const checkPassword = () => {
    return body('password')
        .notEmpty().withMessage("Password is required.").bail()
        .isStrongPassword(passwordConfig).withMessage(_passwordHelper);
}

const email = () => {
    return body('email')
        .trim().notEmpty().withMessage('Email is required').bail()
        .normalizeEmail({all_lowercase: true})
        .matches(/[^$. ]/).withMessage("Username cannot contain '$' or ' '")
}

const checkDOB = () => {
    return body('DOB')
        .trim().notEmpty().withMessage('DOB is missing').bail()
        .custom((value) => {
            const regEx = /^[12][0-9]{3}-[01][0-9]-[0-3][0-9]$/;
            const re = new RegExp(regEx);
            if (!re.test(value)) {
                throw new Error('Invalid format for date of birth')
            }
            const date = value.split('-', limit = 3)
            const month = date[1];
            const day = date[2];

            if (month < 1 || month > 12) {
                throw new Error("Invalid month")
            }
            if (day <= 0) {
                throw new Error("Invalid day");
            }
            switch (month) {
                case '1':
                case '3':
                case '5':
                case '7':
                case '8':
                case '10':
                case '12':
                    if ( day >= 31) {
                        throw new Error("Invalid day")
                    }
                    break;
                case '6':
                case '9':
                case '11':
                    if (day >= 30) {
                        throw new Error("Invalid day")
                    }
                    break;
                case '2':
                    const m = parseInt(month);
                    if (m % 4 === 0 && day !== 29) {
                        throw new Error("Invalid day");
                    }
                    else if (m % 4 !== 0 && day !== 28) {
                        throw new Error("Invalid day")
                    }
            }
            return true;
        })
}

module.exports = {checkUsername, checkPassword, checkDOB, email, isJson}