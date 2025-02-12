import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import * as serviceWorker from './serviceWorker';
// import { routes } from './scripts/routes';
import configureStore from './scripts/store/configureStore';
import App from './scripts/components/Pages/App';
import './css/global/bootstrap.css';
import './css/style.css';
import logo from './images/icons/logo_fill_white.svg';

const store = configureStore();
const baseURI = 'https://www.platypus.null-terminator.com/api/';

const Root = ({store}) => (
    <Provider store={store}>
        <App logo={logo} baseURI={baseURI} />
    </Provider>
)
render(
    <Root store={store} />,
    document.getElementById('root'),
);

// serviceWorker.register();
