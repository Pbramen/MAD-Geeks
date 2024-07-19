import axios from 'axios';

const base_URL = 'http://localhost:4000';

export default axios.create({
    baseURL: base_URL,
    method: 'cors',
    credentials: 'include',
    headers: {
        "Accept": 'application/json'
    }
})

// axios instance used only for protected routes
export const axiosPrivate = axios.create({
    baseURL: base_URL,
    method: 'cors',
    withCredentials: true,
    headers: {
        "Accept": 'application/json'
    }
})