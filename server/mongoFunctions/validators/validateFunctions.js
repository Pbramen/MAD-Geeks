// checks for min of 8 characters, 1 lowercase, 1 uppercase, and 1 symbol.
function checkPassword(value) { 
    var n = value.length; 
    var oneUpper = false;
    var oneLower = false;
    var oneSymbol = false;
    var oneDigit = false;
    var i;

    //excludes ( ' " . $ )
    var symbols = new Set([32, 33, 35, 37, 38, 39, 40, 41, 42, 43, 44, 45, 47, 58, 59, 60, 61, 62, 63, 64, 91, ,92, 93, 94, 95, 96, 123, 124, 125, 126 ]);
    if (n >= 8) {
        for (i = 0; !(oneUpper && oneLower && oneSymbol) && (i < n); i++){
            let c = value.charCodeAt(i);
            // symbol
            if (symbols.has(c)) {
                oneSymbol = true;
            }
            // digits
            else if (47 < i && i < 58) {
                oneDigit = true;
            }
            // uppercase
            else if(64 < i && i < 91){  
                oneUpper = true;
            }
            else if (96 < i && i < 123) {
                oneLower = true;
            }
        }    
    }

    return false;
}

function checkEmail(value) {
    //return validator.isEmail(value);
}
function checkIfValidAge(value) { 
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth()
    const day = date.getDay()

    var splitValue = value.split("-")
    var validAge = true
    
    if (splitValue.length !== 3) {
        console.log('Invalid user input');
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
        if (!(47 < i && i < 58) &&      // check for digits
            !(64 < i && i < 91) &&      // check for uppercase
            !(96 < i && i < 123))       // check for lowercase
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
    isAlphaNumeric
}