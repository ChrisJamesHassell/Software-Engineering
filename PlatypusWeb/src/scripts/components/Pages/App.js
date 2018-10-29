import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { RouteWithSubRoutes, routes } from '../../routes';
import { Dashboard } from './Dashboard';
import AppNavbar from '../Navbar/AppNavbar';
import Login from './Login';


/**************************************/
//  We want to:
// ----------------------------------- //
//  1. Check to see if user is logged in (dash)
//  2. If not, display login page
//  3. If yes, display Dashboard

const App = () => (
    <Router>
        <div id="container">
            <AppNavbar />
            <Route exact path="/" component={Login} />
            {routes.map((route, i) => <RouteWithSubRoutes key={i} {...route} />)}
        </div>
    </Router>
);

export default App;