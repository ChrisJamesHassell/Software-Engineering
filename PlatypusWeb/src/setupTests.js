// in app/src/setupTests.js file
const Enzyme = require('enzyme');
// this is where we reference the adapter package installed  
// earlier
const EnzymeAdapter = require('enzyme-adapter-react-16');
// This sets up the adapter to be used by Enzyme
Enzyme.configure({ adapter: new EnzymeAdapter() });