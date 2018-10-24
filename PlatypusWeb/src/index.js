import * as serviceWorker from './serviceWorker';
import React from 'react';
import { render } from 'react-dom';
import { routes } from './scripts/routes';
import App from './scripts/components/Pages/App';
import './css/global/bootstrap.css';
import './css/style.css';


render(
    <App routes={routes} />,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.register();
