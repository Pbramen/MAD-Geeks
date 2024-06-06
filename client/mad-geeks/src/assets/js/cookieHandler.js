import { jwtDecode } from 'jwt-decode';

export function decodeJWT(token) {
    try {
        return jwtDecode(token);
    } catch (e) {
        //TODO: log to db here..
        console.log(e);
        return false;
    }
}

