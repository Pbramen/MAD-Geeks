const { isConstructorDeclaration } = require("typescript");

function getResourceByClass (req, res, next) {
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

    if (validClasses.includes(req?.params?.class)) {
        const myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");


        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };


        fetch(`https://www.dnd5eapi.co/api/classes/${req.params.class}/levels`, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                console.log(result);
                console.log(typeof result);
                if (!result.error)
                    return res.status(200).json({ status: 'ok', msg: 'Data fetched successfully', payload: result })
                else {
                    next (new Error("Unknown error with 5eAPI"))
                }
            })
            .catch((error) => {
                console.log('Error was thrown', error)
                res.status(400).json({ status: 'ERROR', msg: "Unable to connect to API" });
                next(error);
                return;
            })

    }
    else {
        next(new Error("Invalid parameter sent."))
        return;
    }
    
}

module.exports = {getResourceByClass}