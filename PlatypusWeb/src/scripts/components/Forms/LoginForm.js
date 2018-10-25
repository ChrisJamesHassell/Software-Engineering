import React from 'react';
import { FormGroup, Button, FormControl, HelpBlock, Alert } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import { Dashboard } from '../Pages/Dashboard';
import TextInput from './TextInput';
import { path, fetchJSON } from '../../fetchHelpers';

export default class LoginForm extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            cookie: null,
            route: path + '/user/login/',
            username: '',
            password: '',
            error: ''
        }
        this.updateVals = this.updateVals.bind(this);
        this.validateResponse = this.validateResponse.bind(this);
        this.handleJsonResponse = this.handleJsonResponse.bind(this);
        this.logError = this.logError.bind(this);
    }

    handleClick() {
        var opts = {
            method: 'POST',
            credentials: 'include',
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                'username': this.state.username,
                'password': this.state.password
            })
        };

        fetchJSON(this.state.route, this.validateResponse, this.logError, this.handleJsonResponse, opts);
    }

    updateVals(id, value) {
        if (id === "username") this.setState({ username: value })
        else this.setState({ password: value })
    }

    validateResponse(result) {
        this.setState({ cookie: document.cookie });
        if (!result.ok) throw Error(result.statusText);
        return result;

    }

    handleJsonResponse(response) {
        var status = response.status;
        (status === "ERROR" || status === "FAIL") && this.setState({ error: response.message });
        this.props.btnFunc(response);
    }

    logError(error) {
        this.setState({ error: error });
    }

    render() {
        return (
            <form action={this.state.route} method="POST">
                <FormGroup controlId="userName">
                    <TextInput
                        type={'text'}
                        name={'username'}
                        label={'User Name'}
                        placeholder={'Enter your user name'}
                        updateVals={this.updateVals} />
                </FormGroup>

                <FormGroup controlId="userPassword" >
                    <TextInput
                        type={'password'}
                        name={'password'}
                        label={'Password'}
                        placeholder={'Enter your password'}
                        updateVals={this.updateVals} />
                </FormGroup>
                <Button bsStyle='success' style={{ width: '100%' }} onClick={this.handleClick.bind(this)}>Login</Button>

                    <Alert bsStyle="danger" hidden={!(this.state.error.length > 0)}>
                        <p>
                            {this.state.error.length}
                            {this.state.error}
                        </p>
                    </Alert>

            </form>
        );
    }
}