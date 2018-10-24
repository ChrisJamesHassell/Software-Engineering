import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect, withRouter, Link } from "react-router-dom";
import { RouteWithSubRoutes, routes } from '../../routes';
import { Dashboard } from './Dashboard';
import AppNavbar from '../Navbar/AppNavbar';
// import Login from './Login';

import { Button, Grid, Row, Col } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import LoginForm from '../Forms/LoginForm';
import SignupForm from '../Forms/SignupForm';
import logo from '../../../images/icons/logo_fill_white.svg';

/**************************************/
//  We want to:
// ----------------------------------- //
//  1. Check to see if user is logged in (dash)
//  2. If not, display login page
//  3. If yes, display Dashboard


const App = () => (
    <Router>
        <div>
            <AuthButton />
            <Route path="/login" component={Login} />
            <PrivateRoute path="/dashboard" component={Dashboard} />
        </div>
    </Router>
);

const authenticate = {
    isAuthenticated: document.cookie.length > 0,
    authenticate(cb) {
        this.isAuthenticated = true;
        setTimeout(cb, 100); // fake async
    },
    signout(cb) {
        this.isAuthenticated = false;
        setTimeout(cb, 100);
    }
};

const AuthButton = withRouter(
    ({ history }) =>{
        var redirect = !history.location.pathname.includes("login")
        
        return(
            authenticate.isAuthenticated ? (
                <p>
                    Dashboard!!!{" "}
                    <button
                        onClick={() => {
                            authenticate.signout(() => history.push("/"));
                        }}
                    >
                        Sign out
              </button>
                </p>
            ) : (
                    redirect? <Redirect to="/login" /> : <span></span>
                )
        )
    })

const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route
        {...rest}
        render={props =>
            authenticate.isAuthenticated ? (
                <Component {...props} />
            ) : (
                    <Redirect
                        to={{
                            pathname: "/login",
                            state: { from: props.location }
                        }}
                    />
                )
        }
    />
);

class Login extends React.Component {
    state = {
        redirectToReferrer: false
    };

    login = (data) => {
        console.log("GOT TO LOGIN 'auth' with DATA: ", data);
        authenticate.authenticate(() => {
            this.setState({ redirectToReferrer: true });
        });
    };

    render() {
        const { from } = this.props.location.state || { from: { pathname: "/dashboard" } };
        const { redirectToReferrer } = this.state;
        var logoUrl = window.location.origin + '/' + logo;
        var isLogin = this.props.location.pathname === "/login";
        var buttonLabel = isLogin? "Login" : "Submit";

        if (redirectToReferrer) {
            return <Redirect to={from} />;
        }

        return (
            <div>
                <Grid id='row-container'>
                    <Row id='row-space'>

                    </Row>
                    <Row id='login'>
                        <Col id='login-extra' xsHidden md={8}>
                            <div>
                                <h1>Organize.</h1>
                                <h1>Plan.</h1>
                                <h1>Live.</h1>
                                <p>
                                    Hey, adulting is hard. We get it. That's why Platypus provides
                                    a sleek, modern interface to help you adult at maximum efficiency.
                        </p>
                                <p>
                                    <Button bsStyle='success' bsSize='large'>Learn More</Button>
                                </p>
                            </div>
                        </Col>
                        <Col id='login-logo' smHidden mdHidden lgHidden xs={12}>
                            <img src={logoUrl} alt="white logo" />
                        </Col>
                        <Col id='login-creds' xs={12} md={4}>
                            <div>
                                <p>
                                    <LinkContainer to="/login"><Button bsStyle="link" disabled={isLogin}>Login</Button></LinkContainer> or
                                    <LinkContainer to="/login/signup"><Button bsStyle="link" disabled={!isLogin}> Sign Up</Button></LinkContainer>
                                </p>
                                <Route exact path="/login" render={(props) => <LoginForm {...props} buttonLabel={buttonLabel} auth={this.login.bind(this)} />} />
                                <Route path="/login/signup" render={(props) => <SignupForm {...props} />} buttonLabel={buttonLabel} auth={this.login.bind(this)} />
                            </div>
                        </Col>
                    </Row>
                </Grid>
                <button onClick={this.login}>Log in</button>
            </div>
        );
    }
}

export default App;