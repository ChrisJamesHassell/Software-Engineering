import React from 'react';
import { render } from 'react-dom';
// import { Provider } from 'react-redux';
// import configureStore from './scripts/store/configureStore';
import { routes } from './scripts/routes';
import Main from './scripts/components/Pages/Main';
import './css/style.css';
import logo from './images/icons/logo_fill_white.svg'


//const store = configureStore();
const baseURI = "https://www.platypus.null-terminator.com/api/";

render(
    <Main routes={routes} logo={logo} baseURI={baseURI} />,
    document.getElementById('root')
);

// render(
//     <Provider store={store}>
//         <Main routes={routes} />
//     </Provider>, 
//     document.getElementById('root')
// );

