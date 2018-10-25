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


function deleteAllCookies() {
    var cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
}
/**************************************/
//  We want to:
// ----------------------------------- //
//  1. Check to see if user is logged in (dash)
//  2. If not, display login page
//  3. If yes, display Dashboard

const authenticate = {
    isAuthenticated: document.cookie.length > 0,
    path: '/login',
    authenticate(cb) {
        this.path = '/dashboard';
        this.isAuthenticated = true;
        setTimeout(cb, 100); // fake async
    },
    signout(cb) {
        this.isAuthenticated = false;
        this.path = '/login';
        deleteAllCookies();
        setTimeout(cb, 100);
    },
    getPath() {
        return this.path;
    }
};

const App = () => {
    return (
        <Router>
            <div>
                <AuthButton />
                {/* <Redirect to={authenticate.path} from="/" /> */}
                <Route path="/login" component={Login} />
                <PrivateRoute path="/dashboard" component={Dashboard} />
            </div>
        </Router>
    );
}



const AuthButton = withRouter(
    ({ history }) => {
        var redirect = !history.location.pathname.includes("login") && !authenticate.isAuthenticated;
        // console.log("AuthButton auth.isAuth: ", authenticate.isAuthenticated);
        // console.log("AuthButton history: ", history);
        // console.log("Auth path: ", history.location.pathname);
        // console.log("Auth redirect: ", redirect);

        return (
            authenticate.isAuthenticated ? (
                <button onClick={() => { authenticate.signout(() => history.push("/login")); }}>
                    Sign out
                    </button>
            ) : (redirect ? <Redirect to="/login" /> : <span></span>)
        )
    })

const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route
        {...rest}
        render={props =>
            authenticate.isAuthenticated ? (
                <div>
                    <Component {...props} />
                </div>

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
    constructor(props) {
        super(props);
        this.state = {
            redirectToReferrer: false,
            message: ''
        }

        this.login = this.login.bind(this);
    }

    login = (response) => {
        console.log("GOT TO LOGIN 'auth' with DATA: ", response);
        var message = response.message;
        var isSuccess = response.status === "SUCCESS";
        authenticate.authenticate(() => {
            this.setState({ message: message });
            this.setState({ redirectToReferrer: isSuccess });
        });
    };

    render() {
        const { from } = this.props.location.state || { from: { pathname: "/dashboard" } };
        const { redirectToReferrer } = this.state;
        var logoUrl = window.location.origin + '/' + logo;
        var isLogin = this.props.location.pathname === "/login";
        var buttonLabel = isLogin ? "Login" : "Submit";

        if (redirectToReferrer) {
            return <Redirect to={from} />;
        }

        return (
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
                            <Route exact path="/login" render={(props) => <LoginForm {...props} btnFunc={this.login} buttonLabel={buttonLabel} />} />
                            <Route path="/login/signup" render={(props) => <SignupForm {...props} />} btnFunc={this.login} buttonLabel={buttonLabel} />
                        </div>
                    </Col>
                </Row>
            </Grid>
        );
    }
}

export default App;