const path = window.location.origin.toLowerCase().includes('platypus') ? '' : 'http://localhost:8080';

function deleteAllCookies() {
    var cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
}

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
    readResponseAsJSON,
    deleteAllCookies
}