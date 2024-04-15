/**
 * Builds a basic error response. 
 * @param {ERROR} e - error object thrown 
 * @param {*} code - HTTP status code
 * @param {*} msg - Custom message for client
 * @param {*} action - description or link to next step
 */
function handleError(e, code, msg, action) {
    //TODO MUST LOG TO DB HERE
    console.log(`${e.code} : ${e.message}`)
    let json = {
        "Status": code,
        "MSG": msg,
        "Action": action
    }
    json = JSON.stringify(json);
    return json;
}

module.exports = {
    handleError
}