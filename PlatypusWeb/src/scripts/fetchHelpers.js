const path = window.location.origin.toLowerCase().includes('platypus') ? '/api' : 'http://localhost:8080/api';

function deleteAllCookies() {
    var cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }
}

var hasCookie = document.cookie.length > 0;
var currentPath = window.location.pathname;

export {
    path,
    currentPath,
    hasCookie,
    deleteAllCookies
}