import jwt from 'jsonwebtoken';


export const getJwt = () => {
    return localStorage.getItem("jwt-token");
};

export const isJwtExpired = (token) => {
    var isExpired = false;
    var decodedToken=jwt.decode(token, {complete: true});

    // * 1000 to sync numeric time unit
    var dateExp = new Date(decodedToken.payload.exp * 1000);
    var dateNow = new Date();

    if(decodedToken < dateNow) {
        isExpired = true;
    }

    return isExpired;
};

export default {getJwt, isJwtExpired};