const path = window.location.origin.toLowerCase().includes('platypus') ? '/api' : 'http://localhost:8080/api';

function deleteAllCookies() {
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i += 1) {
    const cookie = cookies[i];
    const eqPos = cookie.indexOf('=');
    const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    if (window.location.origin.includes('platypus')) document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=.platypus.null-terminator.com`; // .platypus.null-terminator.com
  }
}

const hasCookie = document.cookie.length > 0;
const currentPath = window.location.pathname;

export {
  path,
  currentPath,
  hasCookie,
  deleteAllCookies,
};
