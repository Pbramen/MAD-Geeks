import { SetStateAction, useState, useEffect } from "react"

// Types
import { ProficiencyChoicesResSchema } from "ts/interface/response.interface";

// For RESTful api calls 
import axios from "api/axios";
import { AxiosResponse } from "axios";

// classProficiencies is READ ONLY
export const useLoadProficiencyChoices = (setErrorState: React.Dispatch<SetStateAction<string>>, setLoadingState: React.Dispatch<SetStateAction<boolean>>) => {
    const [classProficencies, setClassProficencies] = useState < ProficiencyChoicesResSchema | {}>({});
    const [selectedSkills, setSelectedSkills] = useState<Set<string>>(new Set());

    const getProficiencies = (name: string): Promise<AxiosResponse<ProficiencyChoicesResSchema>> => {
        return axios.get('api/SRD/levelResource/' + name, { signal: AbortSignal.timeout(5000) })
    }

    // eslint-disable-next-line
    useEffect(() => {
        // When user first loads up the form, immediately attempt to grab data needed to render form elements
        if (classProficencies === null || Object.keys(classProficencies).length === 0) {
            console.log("testing...")
            var data = {}
            
            Promise.all([getProficiencies('bard'), getProficiencies('barbarian'), getProficiencies('fighter')])
                .then((result ) => {
                    
                    for (let i = 0; i < result.length; i++){
                        let obj: AxiosResponse<ProficiencyChoicesResSchema> = result[i];
                        if (obj.status === 200 && obj.statusText === 'OK' && obj.data) {
                            let tempData = obj.data;
                            let payload = tempData.payload;
                            data[payload.name] = payload;
                        }
                    }
                    //console.log(data);
                    setClassProficencies(data);
                }).catch(() => {
                    // TODO: axios promise.all will not specify what type of error...
                    setErrorState("Server timeout!");
                }).finally(() => {
                    // prevent ui from flashing too quickly on cache hit.
                    setTimeout(() => {
                        console.log("load done...!")
                        setLoadingState(() => false);
                    }, 300)
            })
            }
    }, [])

    return {classProficencies, selectedSkills, setSelectedSkills}
}