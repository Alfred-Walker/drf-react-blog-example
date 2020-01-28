import jwt from 'jsonwebtoken';


const JWT_TOKEN_KEY = "jwt-token";

export const clearJwt = () => {
    localStorage.removeItem(JWT_TOKEN_KEY);
}

export const getJwt = () => {
    return localStorage.getItem(JWT_TOKEN_KEY);
};

export const setJwt = (token) => {
    localStorage.setItem(JWT_TOKEN_KEY, token);
}

export const isJwtExpired = (token) => {
    var isExpired = false;
    var decodedToken=jwt.decode(token, {complete: true});

    // * 1000 to sync numeric time unit
    var dateExp = new Date(decodedToken.payload.exp * 1000);
    var dateNow = new Date();
    
    if(dateExp < dateNow) {
        isExpired = true;
    }

    return isExpired;
};

export default { clearJwt, getJwt, setJwt, isJwtExpired };