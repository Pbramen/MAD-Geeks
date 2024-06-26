const validator = require("email-validator");
// Validator functions used for mongoose (second layer)

function _passwordHelper(value) {
    var n = value.length; 
    var oneUpper = false;
    var oneLower = false;
    var oneSymbol = false;
    var oneDigit = false;
    var i;
    var errs = [];

    //excludes ( ' " . $ )
    const symbols = new Set([32, 33, 35, 37, 38, 39, 40, 41, 42, 43, 44, 45, 47, 58, 59, 60, 61, 62, 63, 64, 91, ,92, 93, 94, 95, 96, 123, 124, 125, 126 ]);

    for (i = 0; !(oneUpper && oneLower && oneSymbol && oneDigit) && (i < n); i++) {
        let c = value.charCodeAt(i);
        // symbol
        if (symbols.has(c)) {
            oneSymbol = true;
        }
        // digits
        else if (47 < c && c < 58) {
            oneDigit = true;
        }
        // uppercase
        else if (64 < c && c < 91) {
            oneUpper = true;
        } //lowercase
        else if (96 < c && c < 123) {
            oneLower = true;
        }
    }
    if (!oneSymbol) {
        errs.push("one symbol");
    }
    
    if (!oneDigit) {
        errs.push("one digit");
    }
    
    if (!oneLower) {
        errs.push("one lowercase letter");
    }
    
    if (!oneUpper) {
        errs.push("one uppercase letter");
    }
    if (n < 8) {
        errs.push("min length of 8"); 
    }
    return errs;
}

// checks for min of 8 characters, 1 lowercase, 1 uppercase, and 1 symbol.
function checkPassword(value) { 

    const err = _passwordHelper(value);
    let a = errs.length;
    if (a !== 0) {
        let i = 0;
        var msg = "Password must contain:";

        for (i = 0; i < a; i += 1) {
            if (i !== a - 1) {
                msg += ' ' + errs[i] + ',';
            }
            else {
                msg += ' and ' + errs[i] + '.';
            }
        }
        throw new Error(msg);
    }
    return true;
}

function checkEmail(value) {
    return validator.validate(value);
}

function checkIfValidAge(value) { 
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth()
    const day = date.getDay()

    var splitValue = value.split("-")
    var validAge = true
    
    if (splitValue.length !== 3) {
        return false;
    }
    else{
        splitValue = splitValue.map((el)=>{
            return parseInt(el, 10)
        })
        if (year - splitValue[0] < 13)
            validAge = false
        else if (month - splitValue[1] < 0)
            validAge = false
        else if (month - splitValue[1] == 0 && day - splitValue[2] < 0)
            validAge = false
        return validAge;
    }
}

// check alpha-numeric.
function isAlphaNumeric(value) {
    // checks for character code
    var i;
    var n = value.length;
    for (i = 0; i < n; i++){
        let c = value.charCodeAt(i);
        if (!((47 < c && c < 58) ||      // check for digits
             (64 < c && c < 91) ||       // check for uppercase
             (96 < c && c < 123)))       // check for lowercase
        {
            return false;
        }
    }
    return true;
}

module.exports = {
    checkPassword,
    checkIfValidAge,
    checkEmail,
    isAlphaNumeric,
    _passwordHelper
}