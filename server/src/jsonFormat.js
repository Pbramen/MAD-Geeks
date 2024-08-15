/**
 * Must be called to create a consistant json format
 * @returns {JSON} - json object for response.
 */
function createJson(msg, status = "ok", action="None taken") {
    return {
        status: status,
        msg: msg,
        action: action
    }
}

module.exports = {
    createJson
}