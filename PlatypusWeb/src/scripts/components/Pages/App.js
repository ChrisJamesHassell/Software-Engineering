import React from 'react';
import {
  BrowserRouter as Router, Route, Redirect, withRouter,
} from 'react-router-dom';
import { connect } from 'react-redux';
import { AuthLayout } from '../Layouts/AuthLayout';
import { hasCookie } from '../../fetchHelpers';
import AppNavbar from '../Navbar/AppNavbar';
import Login from './Login';

const Home = withRouter((props) => {
  const thispath = window.location.pathname;
  const matches = thispath === props.home;

  if (hasCookie) {
    if (!matches && ['/', '/login'].includes(thispath)) {
      return <Redirect to="/dashboard" />;
    }

    return <span hidden />;
  }

  if (!matches && !['/login/login', '/login/signup'].includes(thispath)) {
    return <Redirect to="/login" />;
  }

  return <span hidden />;
});

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props => (hasCookie === true ? <Component {...props} {...rest} /> : <span />)}
  />
);

const App = () => {
  const home = hasCookie ? '/dashboard' : '/login';
  return (
    <Router>
      <div id="container">
        <AppNavbar isAuth={hasCookie} />
        <Route path="/login" render={props => <Login {...props} />} />
        <PrivateRoute path="/dashboard" component={AuthLayout} />
        <Home home={home} />
      </div>
    </Router>
  );
};

const mapStateToProps = state => ({
  pinFilter: state.pinFilter,
  categoryFilter: state.categoryFilter,
  groupFilter: state.groupFilter,
});

export default connect(mapStateToProps)(App);
