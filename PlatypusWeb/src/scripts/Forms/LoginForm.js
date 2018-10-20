import React from 'react';
import { FormGroup, Button, FormControl } from 'react-bootstrap';

import TextInput from './TextInput';

export default class LoginForm extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            userName: null,
            userPassword: null
        }
        this.setValidationState = this.setValidationState.bind(this);
    }

    setValidationState(id, validation) {
        if (id == 'userName') this.setState({ userName: validation });
        else this.setState({ userPassword: validation });
    }

    render() {
        return (
            <form>
                <FormGroup
                    controlId="userName"
                    validationState={this.state.userName || null}
                >
                    <TextInput
                        label={'User Name'}
                        placeholder={'Enter your user name'}
                        setValidationState={this.setValidationState} />
                    <FormControl.Feedback />
                </FormGroup>

                <FormGroup
                    controlId="userPassword"
                    validationState={this.state.userPassword || null}
                >
                    <TextInput
                        label={'Password'}
                        placeholder={'Enter your password'}
                        setValidationState={this.setValidationState} />
                    <FormControl.Feedback />
                </FormGroup>
                <Button bsStyle='success' style={{width:'100%'}}>Login</Button>
            </form>
        );
    }
}