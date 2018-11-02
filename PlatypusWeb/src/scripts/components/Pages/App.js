import React from 'react';
import {
    BrowserRouter as Router,
    Route,
    Redirect,
    withRouter,
} from 'react-router-dom';
import { Dashboard } from './Dashboard';
import { hasCookie } from '../../fetchHelpers';
import AppNavbar from '../Navbar/AppNavbar';
import Login from './Login';

const App = props => {
    var home = hasCookie ? '/dashboard' : '/login';
    return (
        <Router>
            <div id="container">
                <AppNavbar isAuth={hasCookie} />
                <Route path="/login" render={props => <Login {...props} />} />
                <PrivateRoute path="/dashboard" component={Dashboard} />
                <Home home={home} />
            </div>
        </Router>
    );
};

const Home = withRouter(props => {
    var thispath = window.location.pathname;
    var matches = thispath === props.home;
    return hasCookie ? (
        !matches && ['/', '/login'].includes(thispath) ? (
            <Redirect to="/dashboard" />
        ) : (
            <span hidden />
        )
    ) : !matches && !['/login/login', '/login/signup'].includes(thispath) ? (
        <Redirect to="/login" />
    ) : (
        <span hidden />
    );
});

const PrivateRoute = ({ component: Component, ...rest }) => {
    return (
        <Route
            {...rest}
            render={props =>
                hasCookie === true ? (
                    <Component {...props} {...rest} />
                ) : (
                    <span />
                )
            }
        />
    );
};

export default App;
