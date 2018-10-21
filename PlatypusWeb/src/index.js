import React from 'react';
import { render } from 'react-dom';
// import { Provider } from 'react-redux';
// import configureStore from './scripts/store/configureStore';
import { routes } from './scripts/routes';
import Main from './scripts/components/Pages/Main';
import './css/style.css';


//const store = configureStore();
const baseURI = "https://www.platypus.null-terminator.com/api/";

render(
    <Main routes={routes} baseURI={baseURI} />,
    document.getElementById('root')
);

// render(
//     <Provider store={store}>
//         <Main routes={routes} />
//     </Provider>, 
//     document.getElementById('root')
// );

