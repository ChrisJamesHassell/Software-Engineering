import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect, withRouter, Link } from "react-router-dom";
import { RouteWithSubRoutes, routes } from '../../routes';
import { Dashboard } from './Dashboard';
import { deleteAllCookies} from '../../fetchHelpers';
import AppNavbar from '../Navbar/AppNavbar';
// import Login from './Login';

import { Button, Grid, Row, Col } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import LoginForm from '../Forms/LoginForm';
import SignupForm from '../Forms/SignupForm';
import logo from '../../../images/icons/logo_fill_white.svg';

const authenticate = {
    isAuthenticated: document.cookie.length > 0,
    authenticate(cb) {
        this.isAuthenticated = true;
        setTimeout(cb, 100); // fake async
    },
    signout(cb) {
        this.isAuthenticated = false;
        deleteAllCookies();
        setTimeout(cb, 100);
    }
};

const App = (props) => {
    return (
        <Router>
            <div>
                <AppNavbar />
                <AuthButton />
                <Route path="/login" component={Login} />
                <PrivateRoute path="/dashboard" component={Dashboard} />
            </div>
        </Router>
    );
}



const AuthButton = withRouter(
    ({ history }) => {
        var redirect = !history.location.pathname.includes("login") && !authenticate.isAuthenticated;
        var currPath = history.location.pathname;
        var authComponent = <button onClick={() => { authenticate.signout(() => history.push("/login")); }}>Sign out</button>;
        if(currPath === "/" && authenticate.isAuthenticated) authComponent = <Redirect to="/dashboard" from="/" />
        return (
            authenticate.isAuthenticated ? ( authComponent ) : (redirect ? <Redirect to="/login" /> : <span></span>)
        )
    })

const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route
        {...rest}
        render={props =>
            authenticate.isAuthenticated ? ( <div><Component {...props} /></div>) : ( <Redirect to={{ pathname: "/login", state: { from: props.location }}} /> )}
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
        var isSuccess = response.status === "SUCCESS";
        isSuccess && authenticate.authenticate();
        this.setState({ message: response.message });
        this.setState({ redirectToReferrer: isSuccess });
    };

    render() {
        // const { from } = this.props.location.state || { from: { pathname: "/dashboard" } };
        const { redirectToReferrer } = this.state;
        var logoUrl = window.location.origin + '/' + logo;
        var isLogin = this.props.location.pathname === "/login";

        if (redirectToReferrer) {
            return <Redirect to="/dashboard" />;
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
                            <Route exact path="/login" render={(props) => <LoginForm {...props} btnFunc={this.login} />} />
                            <Route path="/login/signup" render={(props) => <SignupForm {...props} />} btnFunc={this.login} />
                        </div>
                    </Col>
                </Row>
            </Grid>
        );
    }
}

export default App;