import React from 'react';
import { Button, Grid, Row, Col } from 'react-bootstrap';
import LoginForm from '../Forms/LoginForm';
import logo from '../../../images/icons/logo_fill_white.svg';

export default class AppJumbo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
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
                            <p>Hey, adulting is hard. We get it. That's why Platypus provides
                                a sleek, modern interface to help you adult at maximum efficiency.
                            </p>
                            <p>
                                <Button bsStyle='success' bsSize='large'>Learn More</Button>
                            </p>
                        </div>
                    </Col>
                    <Col id='login-logo' smHidden mdHidden lgHidden xs={12}>
                        <img src={logo} />
                    </Col>
                    <Col id='login-creds' xs={12} md={4}>
                        <div><p>Login or <a href=''>Sign Up</a></p></div>
                        <div>
                            <LoginForm />
                        </div>
                    </Col>
                </Row>
            </Grid>
        );
    }
}