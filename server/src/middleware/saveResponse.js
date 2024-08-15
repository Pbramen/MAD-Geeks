const saveJSONResponse = (req, res, next) => {
    var json = res.json;
    res.json = value => {
        console.log("saving response: ");
        console.log(value);
        res.locals.response = value;
        res.json = json;
        return res.json(value);
    }
    next();
}

module.exports = (saveJSONResponse);