import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect, withRouter, Link } from "react-router-dom";
import { RouteWithSubRoutes, routes } from '../../routes';
import { Dashboard } from './Dashboard';
import { path, deleteAllCookies, hasCookie } from '../../fetchHelpers';
import AppNavbar from '../Navbar/AppNavbar';
// import Login from './Login';

import { Button, Grid, Row, Col } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import LoginForm from '../Forms/LoginForm';
import SignupForm from '../Forms/SignupForm';
import logo from '../../../images/icons/logo_fill_white.svg';

// const authenticate = {
//     isAuthenticated: document.cookie.length > 0,
//     authenticate(cb) {
//         this.isAuthenticated = true;
//         setTimeout(cb, 100); // fake async
//     },
//     signout(cb) {
//         this.isAuthenticated = false;
//         deleteAllCookies();
//         setTimeout(cb, 100);
//     }
// };


const App = (props) => {
    var home = hasCookie ? "/dashboard" : "/login";
    return (
        <Router>
            <div>
                <AppNavbar />
                <Route path="/login" render={props => <Login {...props} />} />
                <PrivateRoute path="/dashboard" component={Dashboard} />
                <Home home={home} />
            </div>
        </Router>
    );
}

const Home = withRouter((props) => {
    console.log("HOME PATH: ", props.home);
    console.log("CURRENT PATH: ", window.location.pathname);
    var thispath = window.location.pathname;
    var matches = thispath === props.home;

    return (
        hasCookie ? (!matches && ['/', '/login'].includes(thispath) ? (<Redirect to="/dashboard" />) : (<div></div>)) :
            (!matches && ['/', '/dashboard'].includes(thispath) ? (<Redirect to="/login" />) : (<div></div>))
    )
})

const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={(props) => (
        hasCookie === true
            ? <Component {...props} />
            : <span></span>
    )} />
)
// const PrivateRoute = ({ component: Component, ...rest }) => (
//     <Route {...rest} render={(props) => (
//         hasCookie === true
//             ? <Component {...props} />
//             : <Redirect to={{
//                 pathname: '/login',
//                 state: { from: props.location }
//             }} />
//     )} />
// )

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: false,
            error: null
        }
    }

    login(data) {
        var opts = {
            method: 'POST',
            credentials: 'include',
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                "username": "mikah1337",
                "password": "Password123"
            })
        };
        fetch(path + "/user/login", opts)
            .then(response => this.validateResponse(response)) // If not valid, skips rest and goes to catch
            .then(validResponse => { return validResponse.json() })
            .then(jsonResponse => this.handleJsonResponse(jsonResponse))
            .catch(error => this.logError(error))
    }

    validateResponse(result) {
        if (!result.ok) throw Error(result.statusText);
        return result;
    }

    handleJsonResponse(response) {
        var status = response.status;
        var isSuccess = status === "SUCCESS";

        console.log("Got to handleJson: ", response);
        console.log("ISSUCCESS?: ", isSuccess)
        isSuccess && this.setState({ redirect: true });
        !isSuccess && this.logError(response.message);
    }

    logError(error) {
        this.setState({ error: error });
    }


    render() {
        var redirect = this.state.redirect;
        console.log("REDIRECT?: ", redirect);
        console.log("HAS COOKIE?: ", hasCookie);
        if (redirect) {
            window.location.reload();
            return <Redirect to="/dashboard" />
        }
        return (
            <div>LOGIN
                <div><Button onClick={this.login.bind(this)}>LOGIN</Button></div>
            </div>
        )
    }
}

// class Login extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             redirectToReferrer: false
//         }
//         // this.login = this.login.bind(this);
//     }

//     login = (response) => {
//         var isSuccess = response.status === "SUCCESS";
//         this.setState({ redirectToReferrer: isSuccess });
//     };

//     render() {
//         // const { from } = this.props.location.state || { from: { pathname: "/dashboard" } };
//         const { redirectToReferrer } = this.state;
//         var logoUrl = window.location.origin + '/' + logo;
//         var isLogin = this.props.location.pathname === "/login";
//         console.log("*~*~*~* LOGIN PROPS: ", this.props);
//         // if (redirectToReferrer) {
//         //     return <Redirect to="/dashboard" />;
//         // }

//         return (
//             <Grid id='row-container'>
//                 <Row id='row-space'>

//                 </Row>
//                 <Row id='login'>
//                     <Col id='login-extra' xsHidden md={8}>
//                         <div>
//                             <h1>Organize.</h1>
//                             <h1>Plan.</h1>
//                             <h1>Live.</h1>
//                             <p>
//                                 Hey, adulting is hard. We get it. That's why Platypus provides
//                                 a sleek, modern interface to help you adult at maximum efficiency.
//                         </p>
//                             <p>
//                                 <Button bsStyle='success' bsSize='large'>Learn More</Button>
//                             </p>
//                         </div>
//                     </Col>
//                     <Col id='login-logo' smHidden mdHidden lgHidden xs={12}>
//                         <img src={logoUrl} alt="white logo" />
//                     </Col>
//                     <Col id='login-creds' xs={12} md={4}>
//                         <div>
//                             <p>
//                                 <LinkContainer to="/login"><Button bsStyle="link" disabled={isLogin}>Login</Button></LinkContainer> or
//                                 <LinkContainer to="/login/signup"><Button bsStyle="link" disabled={!isLogin}> Sign Up</Button></LinkContainer>
//                             </p>
//                             <Route exact path="/login" render={(props) => <LoginForm {...props} login={this.login.bind(this)} />} />
//                             <Route path="/login/signup" render={(props) => <SignupForm {...props} />} login={this.login.bind(this)} />
//                         </div>
//                     </Col>
//                 </Row>
//             </Grid>
//         );
//     }
// }

export default App;