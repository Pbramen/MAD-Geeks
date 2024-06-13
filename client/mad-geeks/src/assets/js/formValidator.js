const RETURN_CODE = Object.freeze({
    SUCCESS: 1,
    TYPE_ERROR: -1,
    FAILURE: 0
})

export function isAlpha(a) {
    if (_checkType(a, "string")) {
        let n = a.length;
        
        for (let i = 0; i < n; i++){
            
            let code = a.charCodeAt(i);
            if (!( (code >= 48 && code <= 57) || (code >= 97 && code <= 122)))
                return RETURN_CODE.FAILURE;
        }
        return RETURN_CODE.SUCCESS;    
    }
    else {
        return RETURN_CODE.TYPE_ERROR;
    }
}

export function isNumeric(a) {
    if (_checkType(a, "string")) {
        let n = a.length;
        
        for (let i = 0; i < n; i++){
            let code = a.charCodeAt(i);
            if (! (code >= 48 && code <= 57) )
                return RETURN_CODE.FAILURE;
        }
        return RETURN_CODE.SUCCESS;    
    }
    else {
        if (Number.isInteger(a)) {
            return RETURN_CODE.SUCCESS
        }
        return RETURN_CODE.TYPE_ERROR;
    }
}

export function maxLength(a, max) {
    return a.length > max ? RETURN_CODE.FAILURE : RETURN_CODE.SUCCESS;
}

export function minLength(a, min) { 
    return a.length < min ? RETURN_CODE.FAILURE : RETURN_CODE.SUCCESS;
}

export function minRange(a, min) {
    return a < min ? RETURN_CODE.FAILURE : RETURN_CODE.SUCCESS;
}

export function maxRange(a, max) { 
    return a > max ? RETURN_CODE.FAILURE : RETURN_CODE.SUCCESS;
}

function _checkType(a, type) {
    return typeof a === type;
}

// check password before submit
export function checkPassword(value) { 
    var n = value.length; 
    var oneUpper = false;
    var oneLower = false;
    var oneSymbol = false;
    var oneDigit = false;
    var i;
    var errs = [];

    //excludes ( ' " . $ )
    var symbols = new Set([32, 33, 35, 37, 38, 39, 40, 41, 42, 43, 44, 45, 47, 58, 59, 60, 61, 62, 63, 64, 91, ,92, 93, 94, 95, 96, 123, 124, 125, 126 ]);

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
        return msg;
    }
    return 'ok';
}