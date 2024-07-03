const { validationResult } = require('express-validator');
const { ExpressValidatorError } = require("../errorHandling/ValidationError.js");

const validation = (req, res, next) => {
    const result = validationResult(req);
    if (result && Object.keys(result.errors).length === 0) {
        console.log("Validation/Sanitization passed  for ", req.originalUrl);
        next();
    } else {
        result['status'] = "VS_FAILED";
        res.status(422).json(result);
        console.log("Validation/Sanitization process failed for ", req.originalUrl);
        console.log(result.errors);
        const err = new ExpressValidatorError("Express Validator error", result.errors, req);
        next(err);
    }
}

module.exports = {validation};