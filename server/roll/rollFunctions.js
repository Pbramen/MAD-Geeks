const InvalidParam = require("../errorHandling/customError");
const { dice } = require("../config/rollConfig");

function _rollDie(type, min){
    let n = Math.floor(Math.random() * type) + 1;
    return n > min ? n : min;
}

/*
    Returns an array of results:
        total is returned on index 0,
        remainder are all base results.
*/
function roll(type, quantity, min = 100) {
    if (Number.isNaN(type)) {
        throw new InvalidParam(`Expected number for 'type'. Received ${typeof type} instead.`, 1);
    }
    if (!dice.includes(type)) {
        throw new InvalidParam(`Value ${type} for 'type' is not an accepted die type.`)
    }
    if (Number.isNaN(quantity)) {
        throw new InvalidParam(`Expected number for 'quantity'. Received ${typeof type} instead.`, 2);
    }
    if (Number.isNaN(min)) {
        throw new InvalidParam(`Expected number for 'min'. Received ${typeof min} instead.`, 3);
    }
    if (min > type) {
        throw new InvalidParam("Parameter `min` must be a number <= parameter `type`.", 4);
    }

    if (quantity > 100) {
        quantity = 100;
    }

    var result = new Array(quantity + 1);
    let i = 0; 
    result[0] = 0;
    for (i = 1; i <= quantity; i++){
        let a = _rollDie(type, min);
        result[0] += a;
        result[i] = a;
    }
    return result;
}