const path = window.location.origin.toLowerCase().includes('platypus')
  ? '/api'
  : 'http://localhost:8080/api';

const categories = ['Appliances', 'Auto', 'Meals', 'Medical', 'Miscellaneous'];

const categoryOptions = [
  { label: 'Pick a category...', value: '' },
  { label: 'Appliances', value: 'APPLIANCES' },
  { label: 'Auto', value: 'AUTO' },
  { label: 'Meals', value: 'MEALS' },
  { label: 'Medical', value: 'MEDICAL' },
  { label: 'Miscellaneous', value: 'MISCELLANEOUS' },
];

function catMap(key) {
  let catMap = {};
  categoryOptions.map(category =>{
    catMap[category.label] = category.value;
  });
  return catMap[key];
}

function deleteAllCookies() {
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i += 1) {
    const cookie = cookies[i];
    const eqPos = cookie.indexOf('=');
    const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    if (window.location.origin.includes('platypus')) document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=.platypus.null-terminator.com`; // .platypus.null-terminator.com
  }

  // Now delete all the localStorage data
  // eslint-disable-next-line
  for (const item in localStorage) {
    localStorage.removeItem(item);
  }
}

function getRandomId(events) {
  let id = Math.floor(Math.random() * 100000) + 20;
  events.filter(e => e.id === id).length > 0 && getRandomId(events)
  return id;
}

function getPriorityStyle(key, index, completed = false, props) {
  let classStyle = null;
  if (completed) classStyle = "default";
  let priorityMap = {
      "LOW": { class: classStyle || "info", value: "LOW", key: 1, color: '#3498db' },
      "MID": { class: classStyle || "warning", value: "MEDIUM", key: 2, color: '#f39c12' },
      "HIGH": { class: classStyle || "danger", value: "HIGH", key: 3, color: '#e74c3c' }
  }
  return priorityMap[key];
}

const filterProps = {
  task: 'deadline',
  event: 'endDate',
  doc: 'expirationDate'
}

const itemTypes = ['task', 'event', 'doc'];

const categoryColor = {
  'APPLIANCES': '#229ac7',
  'AUTO': '#18bc9c',
  'MEALS': '#e8c422',
  'MEDICAL': '#f8666b',
  'MISCELLANEOUS': '#a28ad7'
}

const hasCookie = document.cookie.length > 0;

const currentPath = window.location.pathname;

export {
  categories, path, currentPath, hasCookie, deleteAllCookies, getRandomId, categoryColor, itemTypes, getPriorityStyle, filterProps, categoryOptions, catMap
};
