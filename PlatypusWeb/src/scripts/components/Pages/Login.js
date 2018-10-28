import React from 'react';
import { Button, Grid, Row, Col } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Route, Redirect } from 'react-router-dom';
import LoginForm from '../Forms/LoginForm';
import SignupForm from '../Forms/SignupForm';
import logo from '../../../images/icons/logo_fill_white.svg';

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: false,
            error: null
        }
    }

    login(route, data) {
        var opts = {
            method: 'POST',
            credentials: 'include',
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(data)
        };
        fetch(route, opts)
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
        isSuccess && this.setState({ redirect: true });
        !isSuccess && this.logError(response.message);
    }

    logError(error) {
        this.setState({ error: error });
    }


    render() {
        var logoUrl = window.location.origin + '/' + logo;
        var isLogin = this.props.location.pathname === "/login";
        var redirect = this.state.redirect;
        if (redirect) {
            window.location.reload();
            return <Redirect to="/dashboard" />
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
                            <Route exact path="/login" render={(props) => <LoginForm {...props} login={this.login.bind(this)} />} />
                            <Route path="/login/signup" render={(props) => <SignupForm {...props} />} login={this.login.bind(this)} />
                        </div>
                    </Col>
                </Row>
            </Grid>
        )
    }
}