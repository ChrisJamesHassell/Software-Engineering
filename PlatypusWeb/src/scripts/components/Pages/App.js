import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Login from "./Login";
import {Dashboard} from './Dashboard';

/*const App = (props) => {
    return (
        <div id="container">
            <AppNavbar />
            <Login />
        </div>
    );
}*/

const App = () => {
    return (
        <Switch>
            <Route exact path="/" component={Login} />
            <Route
                path="/dashboard"
                render={props => <Dashboard {...props} />}
            />
        </Switch>
    );
};

export default App;