export const handleHttpResponseError = (response) => {
    if (!response.ok) {
        // console.log("response", response);
        // console.log("response.status", response.status);
        // console.log("response.statusText", response.statusText);
        throw Error(response.status);
    }
    return response;
}

export default handleHttpResponseError;
