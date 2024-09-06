const { options } = require("../routers/dndSRD/SRDModel");

const validateSRDClassResponse = (payload) => {
    if (payload?.proficiency_choices && Array.isArray(payload.proficiency_choices)) {
        var potentialSkills = payload.proficiency_choices[0];
        if (!potentialSkills?.from && typeof potentialSkills.from != 'object' &&
            !potentialSkills?.from?.options && !Array.isArray(potentialSkills?.from?.options) &&
            !potentialSkills?.from?.items && typeof potentialSkills?.from?.items != 'object' 

        ) return 'Not found';
        var optionsArray = potentialSkills.from.options;
     
        var payload = [];
        for (let i = 0; i < optionsArray.length; i++){
            var optionElement = optionsArray[i].item;
            if (typeof optionElement != 'object' &&
                !optionElement?.index && typeof optionElement?.index != 'string' &&
                !optionElement?.name && typeof optionElement?.name != 'string' &&
                !optionElement?.url && typeof optionElement?.url != 'string'
            ) return 'Not found';
            optionElement.index = optionElement.index.slice(6)
            payload.push('/api/skills/' + optionElement.index )
        }
        return payload;
    }
    return 'Not found'
}





module.exports = {validateSRDClassResponse} 