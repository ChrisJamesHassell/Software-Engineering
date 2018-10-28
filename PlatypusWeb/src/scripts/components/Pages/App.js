import React from 'react';
import { BrowserRouter as Router, Route, Redirect, withRouter } from "react-router-dom";
import { Dashboard } from './Dashboard';
import { hasCookie } from '../../fetchHelpers';
import AppNavbar from '../Navbar/AppNavbar';
import Login from './Login';


const App = (props) => {
    var home = hasCookie ? "/dashboard" : "/login";
    return (
        <Router>
            <div id="container">
                <AppNavbar />
                <Route path="/login" render={props => <Login {...props} />} />
                <PrivateRoute path="/dashboard" component={Dashboard} />
                <Home home={home} />
            </div>
        </Router>
    );
}

const Home = withRouter((props) => {
    var thispath = window.location.pathname;
    var matches = thispath === props.home;
    return (
        hasCookie ? (!matches && ['/', '/login'].includes(thispath) ? (<Redirect to="/dashboard" />) : (<span hidden></span>)) :
            (!matches && !['/login/login', '/login/signup'].includes(thispath) ? (<Redirect to="/login" />) : (<span hidden></span>))
    )
})

const PrivateRoute = ({ component: Component, ...rest }) => {
    return (
        <Route {...rest} render={(props) => (
            hasCookie === true
                ? <Component {...props} />
                : <span></span>
        )} />
    )
}

export default App;