import React from 'react';
import {
  BrowserRouter as Router, Route, Redirect, withRouter,
} from 'react-router-dom';
import { Dashboard } from './Dashboard';
import { hasCookie } from '../../fetchHelpers';
import AppNavbar from '../Navbar/AppNavbar';
import Login from './Login';


const App = () => {
  const home = hasCookie ? '/dashboard' : '/login';
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

const Home = withRouter((props) => {
  const thispath = window.location.pathname;
  const matches = thispath === props.home;

  if (hasCookie) {
    if (!matches && ['/', '/login'].includes(thispath)) {
      return <Redirect to="/dashboard" />;
    }

    return <span hidden></span>;
  }

  if (!matches && !['/login/login', '/login/signup'].includes(thispath)) {
    return <Redirect to="/login" />;
  }

  return <span hidden></span>;
});

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (
    hasCookie === true
      ? <Component {...props} {...rest} />
      : <span></span>
  )} />
);

export default App;