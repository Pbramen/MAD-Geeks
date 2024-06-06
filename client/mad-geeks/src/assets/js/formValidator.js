const RETURN_CODE = Object.freeze({
    SUCCESS: 1,
    TYPE_ERROR: -1,
    FAILURE: 0
})

export function isAlpha(a) {
    if (_checkType(a, "string")) {
        let n = a.length;
        
        for (let i = 0; i < n; i++){
            let code = char.charCodeAt(i);
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
            let code = char.charCodeAt(i);
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
