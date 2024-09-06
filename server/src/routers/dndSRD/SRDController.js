
const path = require("path")
const { cache } = require(path.resolve(__dirname, '../../cache.js'));
const { validateSRDClassResponse } = require(path.resolve(__dirname, '../../errorHandling/validateSRD'))
const { InvalidParameters } = require(path.resolve(__dirname, '../../errorHandling/ValidationError'));


const hostName = 'https://www.dnd5eapi.co';
const validClasses= [
    'barbarian',
    'bard',
    'fighter',
    'cleric',
    'druid',
    'ranger',
    'rouge',
    'sorcerer',
    'wizard',
    'warlock',
    'monk',
    'paladin'
]
const myHeaders = new Headers();
myHeaders.append("Accept", "application/json");


const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow"
};


const ErrorJSONRes = {
    stats: 'ERROR',
    msg: "Fetch operation failed"
}
// grab all skill proficiency for starting class
function getProficiencyChoices(req, res, next) {
    if (validClasses.includes(req?.params?.class)) {

        const key = 'by_class_' + req.params.class
        if (cache.get(key)) {
            const payload = cache.get(key);
            // get all urls for picking skill proficiency:
            return res.status(200).json({
                status: 'ok', msg: 'SUCCESS', payload: payload
            })
        }

        /*
            get all proficiency and choices.
        */
        var choices;
        fetch(hostName + '/api/classes/' + req.params.class, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                if (result.error) {
                    console.log(result.error);
                    throw new Error("DND5e SRD endpoint ", hostName + '/api/classes/' + req.params.class, "not found");
                }
                return result;
            }).then((result) => {
                const urls = validateSRDClassResponse(result);
                if (!Array.isArray(urls)) throw Error("Data schema changed for " + hostName + '/api/classes/');
                choices = result.proficiency_choices[0]?.choose || 2;

                const promiseList = urls.map(e => {
                    return new Promise((resolve, reject) => {
                        console.log(hostName + e);
                        fetch(hostName + e, requestOptions)
                            .then((response) => response.json())
                            .then((result) => {
                                if (!result.error) {
                                    resolve(result)
                                }
                                else reject(result.error)
                            })
                            .catch((error) => { reject(error) })
                        })
                })
                var returnJSON = {
                    status: '',
                    msg: '',
                    payload: {}
                }
                Promise.all(promiseList).then((result) => {                
                        returnJSON.status = 'ok';
                        returnJSON.msg = 'SUCCESS'
                        returnJSON.payload = {
                            choices: choices,
                            result: result,
                            name: req.params.class
                        }
                        cache.set(key, returnJSON.payload);
                        res.status(200).json(returnJSON);  
                        return next();
                    })
                    .catch((error) => {
                        console.log(error);
                       
                        res.status(200).json(ErrorJSONRes);  
                        return next(error);
                    })

            })
            .catch((error) => {
                console.log('Error was thrown', error)
                res.status(400).json({ status: 'ERROR', msg: "Unable to connect to API" });
                next(error);
                return;
            })

    }
    else {
        
        next(new InvalidParameters("Invalid parameter sent.", ErrorJSONRes, req))
        return;
    }
}


// grab all starting equipment for starting class 
function getStartingEquipment(req, res, next) { 
    if (validClasses.includes(req?.params?.class)) {
        const index = req.params.class;
        const key = 'equip_' + index;

        if (cache.get(key)) {
            res.status(200).json(cache.get(key));
            next();
        }

        fetch(`${hostName}/api/classes/${index}`, requestOptions)
            .then((result) => result.json())
            .then((result) => {
                console.log(result)
                cache.set(key, result);
                res.status(200).json(result);
                return next();
            })
            .catch((error) => {
                res.status(200).json(ErrorJSONRes)
                next(error);
                return;
            })

            }
            else {
                next(new InvalidParameters("Invalid parameter sent.", ErrorJSONRes, req))
            }
}
module.exports = {getProficiencyChoices, getStartingEquipment}