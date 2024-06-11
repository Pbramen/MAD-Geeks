export const formHeaderOptions = (json) =>{
    return {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        headers: {
            "Content-Type": 'application/json',
            "Origin": "http://localhost:3000",
            "Accept": "application/json"
        },
        body: json
    };
}

export const handleResponse = (json_response) => {
    return isValidJSON(json_response);
}

function isValidJSON(json) {
    try {
        JSON.parse(json)
        return true;
    } catch (e) {
        return false;
    }
}