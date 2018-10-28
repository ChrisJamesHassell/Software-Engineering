import React from 'react';
import { FormGroup, Button, Alert } from 'react-bootstrap';
import TextInput from './TextInput';
import { path } from '../../fetchHelpers';

export default class LoginForm extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            route: path + '/user/login',
            data: {
                "username": "",
                "password": ""
            },
            response: {},
            isSuccess: false,
            error: ""
        }
        this.updateVals = this.updateVals.bind(this);
    }

    updateVals(id, value) {
        var temp = this.state.data;
        temp[id] = value;
        var data = Object.assign(this.state.data, temp);
        this.setState({ data: data });
    }

    handleClick() {
        this.props.login(this.state.route, this.state.data);
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
                <Button type="button" bsStyle='success' style={{ width: '100%' }} onClick={this.handleClick.bind(this)} disabled={this.state.data.username.length < 1 || this.state.data.password.length < 1}>Login</Button>
                <Alert bsStyle="danger" hidden={!(this.state.error)}>
                    <p>
                        {this.state.error}
                    </p>
                </Alert>
            </form>
        );
    }
}