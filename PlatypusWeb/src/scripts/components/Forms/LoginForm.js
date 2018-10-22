import React from 'react';
import { FormGroup, Button, FormControl, HelpBlock, Alert } from 'react-bootstrap';
import TextInput from './TextInput';

// This is required to match correctly
const regex = {
    'userName': /^(?=.*[a-zA-Z])[A-Za-z\d]{8,32}$/g,
    'userPassword': /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,32}$/g
}

export default class LoginForm extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            id: null,
            isDisabled: true,
            'userName': {
                validation: null,
                value: null,
                requirements: 'Must be between 8-32 chars in length with no special chars',
                helpText: ''
            },
            'userPassword': {
                validation: null,
                value: null,
                requirements: 'Must be between 8-32 chars in length with 1 uppercase, 1 lowercase, 1 number, and no special chars',
                helpText: ''
            }
        }
        this.getValidationState = this.getValidationState.bind(this);
        this.setValidationState = this.setValidationState.bind(this);
    }

    componentDidUpdate(prevProps, nextProps) {
        var stateChanged = JSON.stringify(nextProps) !== JSON.stringify(this.state);
        if (stateChanged) {
            var formValid = this.state['userName'].validation == 'success' && this.state['userPassword'].validation == 'success';
            this.setState({ isDisabled: !formValid });
        }
    }

    setValidationState(id, validProps) {
        var mergedProps = { ...this.state[id], ...validProps };
        this.setState({ id: id });  // set the current input item id we are on
        this.setState((state) => {  // merge the updated properties
            state[id] = mergedProps;
        });
    }

    getValidationState(id, value) {
        // Get whether or not the input is valid
        var match = value.match(regex[id]);

        // If there WAS a match:
        if (match) this.setValidationState(id, { validation: 'success', value: value, helpText: null });

        // If there was NOT a match
        else {
            let [validation, helpText] = [null, null];  // Clear the error if the field is empty
            if(value.length > 0) [validation, helpText] = ['error', this.state[id].requirements];
            this.setValidationState(id, { validation: validation, value: null, helpText: helpText });
        }
    }

    handleClick(e) {
    }

    render() {
        var userNameHelp = this.state['userName'].helpText;
        var passwordHelp = this.state['userPassword'].helpText
        return (
            <form>
                <FormGroup
                    controlId="userName"
                    validationState={this.state['userName'].validation}
                >
                    <TextInput
                        type={'text'}
                        label={'User Name'}
                        placeholder={'Enter your user name'}
                        requiresValidation={true}
                        getValidationState={this.getValidationState} />
                    <FormControl.Feedback />
                    <HelpBlock><Alert bsStyle="danger" hidden={!userNameHelp}>{userNameHelp}</Alert></HelpBlock>
                </FormGroup>

                <FormGroup
                    controlId="userPassword"
                    validationState={this.state['userPassword'].validation}
                >
                    <TextInput
                        type={'password'}
                        label={'Password'}
                        placeholder={'Enter your password'}
                        requiresValidation={true}
                        getValidationState={this.getValidationState} />
                    <FormControl.Feedback />
                    <HelpBlock><Alert bsStyle="danger" hidden={!passwordHelp}>{passwordHelp}</Alert></HelpBlock>
                </FormGroup>
                <Button type={'submit'} bsStyle='success' style={{ width: '100%' }} onClick={this.handleClick.bind(this)} disabled={this.state.isDisabled}>Login</Button>
            </form>
        );
    }
}