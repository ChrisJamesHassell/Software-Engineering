import React from 'react';
import { Button, Grid, Row, Col } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Link, Route, Switch, Redirect } from 'react-router-dom';
import { RouteWithSubRoutes } from '../../routes';
import LoginForm from '../Forms/LoginForm';
import SignupForm from '../Forms/SignupForm';
import logo from '../../../images/icons/logo_fill_white.svg';

const Login = (props) => {
    var logoUrl = window.location.origin + '/' + logo;
    return (
        <Grid id='row-container'>
            <Row id='row-space'>

            </Row>
            {console.log('==========PROPS==============')}
            {console.log(props)}
            {console.log('==========PROPS.routes (LOGIN)==============')}
            {console.log(props.routes)}
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
                            <LinkContainer to="/login/login"><Button bsStyle="link" disabled={false}>Login</Button></LinkContainer> or
                            <LinkContainer to="/login/signup"><Button bsStyle="link" disabled={false}> Sign Up</Button></LinkContainer>
                        </p>
                        {/* <Switch> */}
                            {console.log("LOGIN auth(): ", props.authenticate)}
                            <Redirect from="/login" to="/login/login" />
                            <Route exact path="/login/login" render={(props) => <LoginForm {...props}  authenticate={props.authenticate} />} />
                            <Route path="/login/signup" render={(props) => <SignupForm {...props} />} />
                        {/* </Switch> */}

                    </div>
                </Col>
            </Row>
        </Grid>
    )
}

export default Login;