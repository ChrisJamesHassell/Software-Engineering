import React from 'react';
import { FormGroup, Button, FormControl, HelpBlock, ControlLabel, Alert } from 'react-bootstrap';
import TextInput from './TextInput';

// This is required to match correctly
const regex = {
    'userName-signup': /^(?=.*[a-zA-Z])[A-Za-z\d]{8,32}$/g,
    'userPassword-signup': /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,32}$/g,
    'firstName-signup': /^(?=.*[A-Za-z])[A-Za-z]{1,32}$/g,
    'lastName-signup': /^(?=.*[A-Za-z])[A-Za-z]{1,32}$/g,
    'email-signup': /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/g,
    'dob-signup': /^.+$/g
}

export default class SignupForm extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            id: null,
            isDisabled: true,
            'userName-signup': {
                validation: null,
                value: null,
                requirements: 'Must be between 8-32 chars in length with no special chars',
                helpText: null
            },
            'userPassword-signup': {
                validation: null,
                value: null,
                requirements: 'Must be between 8-32 chars in length with 1 uppercase, 1 lowercase, 1 number, and no special chars',
                helpText: null
            },
            'firstName-signup': {
                validation: null,
                value: null,
                requirements: 'Must be between 8-32 chars in length and only contain letters',
                helptext: null
            },
            'lastName-signup': {
                validation: null,
                value: null,
                requirements: 'Must be between 8-32 chars in length and only contain letters',
                helptext: null
            },
            'dob-signup': {
                validation: null,
                value: null,
                requirements: '',
                helptext: null
            },
            'email-signup': {
                validation: null,
                value: null,
                requirements: 'That is not a valid email address',
                helptext: null
            }
        }
        this.getValidationState = this.getValidationState.bind(this);
        this.setValidationState = this.setValidationState.bind(this);
    }

    componentDidUpdate(prevProps, nextProps) {
        var stateChanged = JSON.stringify(nextProps) !== JSON.stringify(this.state);
        if (stateChanged) {
            var formValid = this.state['userName-signup'].validation == 'success'
                && this.state['userPassword-signup'].validation == 'success'
                && this.state['firstName-signup'].validation == 'success'
                && this.state['lastName-signup'].validation == 'success'
                && this.state['email-signup'].validation == 'success'
                && this.state['dob-signup'].validation=='success';
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
            if (value.length > 0) [validation, helpText] = ['error', this.state[id].requirements];
            this.setValidationState(id, { validation: validation, value: null, helpText: helpText });
        }
    }

    handleClick(e) {
        console.log(this.state);
        console.log('loginname: ', this.state['userName-signup'].value);
        console.log('password: ', this.state['userPassword-signup'].value);
    }

    render() {
        var userNameHelp = this.state['userName-signup'].helpText;
        var passwordHelp = this.state['userPassword-signup'].helpText;
        // var firstNameHelp = this.state['firstName-signup'].helpText;
        // var lastNameHelp = this.state['lastName-signup'].helpText;
        // var emailHelp = this.state['email-signup'].helptext;
        return (
            <form>
                <FormGroup
                    controlId="userName-signup"
                    validationState={this.state['userName-signup'].validation}
                >
                    <TextInput
                        type={'text'}
                        label={'User Name'}
                        placeholder={'User Name'}
                        requiresValidation={true}
                        getValidationState={this.getValidationState} />
                    <FormControl.Feedback />
                    <HelpBlock><Alert bsStyle="danger" hidden={!userNameHelp}>{userNameHelp}</Alert></HelpBlock>
                </FormGroup>

                <FormGroup
                    controlId="userPassword-signup"
                    validationState={this.state['userPassword-signup'].validation}
                >
                    <TextInput
                        type={'password'}
                        label={'Password'}
                        placeholder={'Password'}
                        requiresValidation={true}
                        getValidationState={this.getValidationState} />
                    <FormControl.Feedback />
                    <HelpBlock><Alert bsStyle="danger" hidden={!passwordHelp}>{passwordHelp}</Alert></HelpBlock>
                </FormGroup>

                <FormGroup
                    controlId="firstName-signup"
                    validationState={this.state['firstName-signup'].validation}
                >
                    <TextInput
                        type={'text'}
                        label={'firstName'}
                        placeholder={'First Name'}
                        requiresValidation={true}
                        getValidationState={this.getValidationState} />
                </FormGroup>

                <FormGroup
                    controlId="lastName-signup"
                    validationState={this.state['lastName-signup'].validation}
                >
                    <TextInput
                        type={'text'}
                        label={'lastName'}
                        placeholder={'Last Name'}
                        requiresValidation={true}
                        getValidationState={this.getValidationState} />
                </FormGroup>

                <FormGroup
                    controlId="dob-signup"
                    validationState={this.state['dob-signup'].validation}
                >
                    <TextInput
                        type={'date'}
                        label={'dob'}
                        placeholder={'Date of birth'}
                        requiresValidation={true}
                        getValidationState={this.getValidationState} />
                </FormGroup>

                <FormGroup
                    controlId="email-signup"
                    validationState={this.state['email-signup'].validation}
                >
                    <TextInput
                        type={'email'}
                        label={'email'}
                        placeholder={'E-mail Address'}
                        requiresValidation={true}
                        getValidationState={this.getValidationState} />
                </FormGroup>

                <Button type={'submit'} bsStyle='success' style={{ width: '100%' }} onClick={this.handleClick.bind(this)} disabled={this.state.isDisabled}>Sign Up</Button>
            </form>
        );
    }
}