const path = window.location.origin.toLowerCase().includes('platypus') ? '' : 'http://localhost:8080';

function readResponseAsJSON(response) {
    return response.json();
}

function fetchJSON(pathToResource, validateResponse, logError, handleJsonResponse, optional) {
    fetch(pathToResource, optional)
        .then(validateResponse) // if not valid, skips rest and goes to catch
        .then(readResponseAsJSON)
        .then(handleJsonResponse)
        .catch(logError);
}

export {
    path,
    fetchJSON,
    readResponseAsJSON
}