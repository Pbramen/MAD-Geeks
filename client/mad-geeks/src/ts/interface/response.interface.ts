interface responseSchema {
    status: string, 
    msg: string
}

// api/SRD/levelResource
export interface ProficiencyChoicesPayload {
    name: string,
    choices: number,
    result: {
        ability_score: {
            index: string,
            name: string,
            url: string
        },
        desc: string[],
        index: string,
        url: string
        name: string
    }[]
}

export interface ProficiencyChoicesResSchema extends responseSchema{
    payload: ProficiencyChoicesPayload   
    
}