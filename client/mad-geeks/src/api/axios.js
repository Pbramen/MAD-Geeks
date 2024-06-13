import axios from 'axios';

export default axios.create({
    baseURL: 'http://localhost:4000',
    method: 'cors',
    credentials: 'include',
    headers: {
        "Accept": 'application/json'
    }
})