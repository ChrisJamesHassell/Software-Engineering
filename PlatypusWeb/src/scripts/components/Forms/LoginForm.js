import React from 'react';
import { Redirect } from 'react-router-dom';
import { FormGroup, Button, Alert } from 'react-bootstrap';
import TextInput from './TextInput';
import { path, fetchJSON } from '../../fetchHelpers';

export default class LoginForm extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            route: path + '/user/login',
            username: '',
            password: '',
            response: {},
            isSuccess: false,
            error: null
        }
        this.updateVals = this.updateVals.bind(this);
        this.validateResponse = this.validateResponse.bind(this);
        this.handleJsonResponse = this.handleJsonResponse.bind(this);
        this.logError = this.logError.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        // var opts = {
        //     method: 'POST',
        //     credentials: 'include',
        //     headers: {
        //         "Content-type": "application/json"
        //     },
        //     body: JSON.stringify({
        //         'username': this.state.username,
        //         'password': this.state.password
        //     })
        // };
        // fetch(this.state.route, opts)
        //     .then(response => this.validateResponse(response)) // If not valid, skips rest and goes to catch
        //     .then(validResponse => { return validResponse.json() })
        //     .then(jsonResponse => this.handleJsonResponse(jsonResponse))
        //     .catch(error => this.logError(error))
        
        // TEMP
        this.props.login();
    }

    updateVals(id, value) {
        if (id === "username") this.setState({ username: value })
        else this.setState({ password: value })
    }

    validateResponse(result) {
        if (!result.ok) throw Error(result.statusText);
        return result;
    }

    handleJsonResponse(response) {
        //(status === "ERROR" || status === "FAIL") && this.setState({ error: response.message });
        console.log("GOT TO HANDLESONRES: ", response);
        var status = response.status;
        var isSuccess = status === "SUCCESS";
        // this.setState({ isSuccess: isSuccess, response: response });
        !isSuccess && this.logError(response.message);
    }

    logError(error) {
        this.setState({ error: error });
    }

    render() {
        return (
            <form action={this.state.route} method="POST" encType="multipart/form-data" onKeyUp={ev => ev.keyCode === 13 && this.handleClick()}>
                <FormGroup controlId="username">
                    <TextInput
                        type={'text'}
                        name={'username'}
                        label={'User Name'}
                        required={true}
                        maxLength={"32"}
                        placeholder={'Enter your user name'}
                        updateVals={this.updateVals} />
                </FormGroup>

                <FormGroup controlId="password" >
                    <TextInput
                        type={'password'}
                        name={'password'}
                        label={'Password'}
                        required={true}
                        maxLength={"32"}
                        placeholder={'Enter your password'}
                        updateVals={this.updateVals} />
                </FormGroup>
                <Button type="button" bsStyle='success' style={{ width: '100%' }} onClick={this.handleClick.bind(this)} disabled={this.state.username.length < 1 || this.state.password.length < 1}>Login</Button>
                <Button onClick={this.handleClick}>LOGIN</Button>
                {/* <Button bsStyle='success' type="submit" style={{ width: '100%' }} disabled={this.state.username.length < 1 || this.state.password.length < 1}>Login</Button> */}
                <Alert bsStyle="danger" hidden={!(this.state.error)}>
                    <p>
                        {this.state.error}
                    </p>
                </Alert>
            </form>
        );
    }
}