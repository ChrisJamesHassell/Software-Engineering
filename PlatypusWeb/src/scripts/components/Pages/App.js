import React from 'react';
import { BrowserRouter as Router, Route, Redirect, withRouter } from "react-router-dom";
import { Dashboard } from './Dashboard';
import { deleteAllCookies, hasCookie } from '../../fetchHelpers';
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
//         setTimeout(cb, 100); // fake async
//     },
//     signout(cb) {
//         deleteAllCookies();
//         setTimeout(cb, 100);
//     }
// };




export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isAuthenticated: hasCookie,
            home: "/login",
            currentPath: "/"
        }
        this.signout = this.signout.bind(this);
    }

    componentDidMount() {
        console.log("**** APP MOUNTED****");
    }

    authenticate() {
        this.setState({
            isAuthenticated: true,
            home: '/dashboard',
            currentPath: window.location.pathname
        });
    }

    signout() {
        this.setState({
            isAuthenticated: false,
            home: '/login',
            currentPath: window.location.pathname
        });
        deleteAllCookies();
    }

    render() {
        console.log("APP STATE: ", this.state);
        return (
            <Router>
                <div>
                    <AppNavbar />
                    <AuthButton isAuthenticated={this.state.isAuthenticated} signout={this.signout} />
                    <Route path="/login" render={(props) => (<Login {...props} authenticate={this.authenticate.bind(this)} />)} />
                    <PrivateRoute path="/dashboard" {...this.state} signout={this.signout} component={Dashboard} />
                </div>
            </Router>
        )
    }
}

// const App = () => {
//     return (
//         <Router>
//             <div>
//                 <AppNavbar />
//                 <AuthButton isAuthenticated={authenticate.isAuthenticated} signout={authenticate.signout} />
//                 <Route path="/login" render={(props) => (<Login {...props} authenticate={authenticate} />)} />
//                 {/* <Route path="/login" component={Login} /> */}
//                 <PrivateRoute path="/dashboard" component={Dashboard} />
//                 {/* <PrivateRoute path="/dashboard" render={(props) => (<Dashboard {...props} authenticate={authenticate} />)} /> */}
//             </div>
//         </Router>
//     );
// }



const AuthButton = withRouter(
    (props) => {
        var redirect = !props.history.location.pathname.includes("login") && !props.isAuthenticated;
        var currPath = props.history.location.pathname;
        var authComponent = <button onClick={() => { props.signout(() => props.history.push("/login")); }}>Sign out</button>;
        if ((currPath === "/" || currPath.includes("login")) && props.isAuthenticated) authComponent = <Redirect to="/dashboard" from="/" />
        return (
            props.isAuthenticated ? (authComponent) : (redirect ? <Redirect to="/login" /> : <span></span>)
        )
    })

const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route
        {...rest}
        render={props =>
            rest.isAuthenticated ? ( <div><Component {...props} /></div>) : ( <Redirect to={{ pathname: "/login", state: { from: props.location }}} /> )}
    />
);


// const PrivateRoute = ({ component: Component, ...rest }) => (
//     <Route
//         {...rest}
//         render={props =>
//             authenticate.isAuthenticated ? ( <div><Component {...props} /></div>) : ( <Redirect to={{ pathname: "/login", state: { from: props.location }}} /> )}
//     />
// );


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
        isSuccess && this.props.authenticate();
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

// class Login extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             redirectToReferrer: false,
//             message: ''
//         }
//         this.login = this.login.bind(this);
//     }

//     login = (response) => {
//         var isSuccess = response.status === "SUCCESS";
//         isSuccess && this.props.authenticate();
//         this.setState({ message: response.message });
//         this.setState({ redirectToReferrer: isSuccess });
//     };

//     render() {
//         // const { from } = this.props.location.state || { from: { pathname: "/dashboard" } };
//         const { redirectToReferrer } = this.state;
//         var logoUrl = window.location.origin + '/' + logo;
//         var isLogin = this.props.location.pathname === "/login";

//         if (redirectToReferrer) {
//             return <Redirect to="/dashboard" />;
//         }

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
//                             <Route exact path="/login" render={(props) => <LoginForm {...props} btnFunc={this.login} />} />
//                             <Route path="/login/signup" render={(props) => <SignupForm {...props} />} btnFunc={this.login} />
//                         </div>
//                     </Col>
//                 </Row>
//             </Grid>
//         );
//     }
// }

// export default App;