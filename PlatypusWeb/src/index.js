import * as serviceWorker from './serviceWorker';
import React from 'react';
import { render } from 'react-dom';
import { routes } from './scripts/routes';
import App from './scripts/components/Pages/App';
import './css/global/bootstrap.css';
import './css/style.css';
import logo from './images/icons/logo_fill_white.svg'


//const store = configureStore();
const baseURI = "https://www.platypus.null-terminator.com/api/";

render(
    <App routes={routes} logo={logo} baseURI={baseURI} />,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.register();