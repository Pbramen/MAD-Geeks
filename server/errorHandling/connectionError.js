const { createJson } = require("../jsonFormat.js");
/**
 * creates a json response for all fields.
 * @param {params} - array of string variables that are undefined.
 * @returns {JSON} - json fomratted object that contains the response.
 */
function handleMissingFields(params){
    var json = createJson("Missing fields", "ERROR");
    json['errors'] = { 'fields': [] }
    json.errors.fields = params;
    return json;
}   


module.exports = {
    handleMissingFields
}