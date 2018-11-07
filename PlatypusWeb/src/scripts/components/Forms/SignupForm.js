import React from 'react';
import {
  FormGroup, Button, FormControl, HelpBlock, Alert,
} from 'react-bootstrap';
import TextInput from './TextInput';
import { path } from '../../fetchHelpers';

// This is required to match correctly
const regex = {
  username: /^(?=.*[a-zA-Z])[A-Za-z\d]{8,32}$/g,
  pass: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,32}$/g,
  firstName: /^(?=.*[A-Za-z])[A-Za-z]{1,32}$/g,
  lastName: /^(?=.*[A-Za-z])[A-Za-z]{1,32}$/g,
  email: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/g,
  dateOfBirth: /^.+$/g,
};

export default class SignupForm extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      id: null,
      isDisabled: true,
      route: `${path}/user/create`,
      data: {
        username: {
          validation: null,
          value: null,
          requirements: 'Must be between 8-32 chars in length with no special chars',
          helpText: null,
        },
        pass: {
          validation: null,
          value: null,
          requirements:
            'Must be between 8-32 chars in length with 1 uppercase, 1 lowercase, 1 number, and no special chars',
          helpText: null,
        },
        firstName: {
          validation: null,
          value: null,
          requirements: 'Must be between 1-32 chars in length and only contain letters',
          helptext: null,
        },
        lastName: {
          validation: null,
          value: null,
          requirements: 'Must be between 1-32 chars in length and only contain letters',
          helptext: null,
        },
        email: {
          validation: null,
          value: null,
          requirements: 'That is not a valid email address',
          helptext: null,
        },
        dateOfBirth: {
          validation: null,
          value: null,
          requirements: '',
          helptext: null,
        },
      },
      error: '',
    };
    this.updateVals = this.updateVals.bind(this);
    this.setValidationState = this.setValidationState.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidUpdate(prevProps, nextProps) {
    const stateChanged = JSON.stringify(nextProps) !== JSON.stringify(this.state);
    const objCount = Object.keys(this.state.data).length;
    if (stateChanged) {
      let formValid = 0;
      Object.keys(this.state.data).forEach((item) => {
        formValid += this.state.data[item].validation === 'success' ? 1 : 0;
      });
      this.setState({ isDisabled: formValid < objCount });
    }
  }

  setValidationState(id, validProps) {
    const mergedProps = Object.assign(this.state.data[id], validProps);
    this.setState({ id }); // set the current input item id we are on
    this.setState(state => ({
      data: {
        ...state.data,
        [id]: mergedProps,
      },
    }));
  }

  updateVals(id, value) {
    const match = value.match(regex[id]); // Get whether or not the input is valid

    // If there WAS a match, set appropriate values
    if (match) {
      this.setValidationState(id, { validation: 'success', value, helpText: null });
    } else {
      // If there was NOT a match
      let [validation, helpText] = [null, null]; // Clear the error if the field is empty

      if (value.length < 1) {
        this.props.clearErrorAlert(); // clear whole form error alert if field is cleared
      }
      if (value.length > 0) [validation, helpText] = ['error', this.state.data[id].requirements];
      this.setValidationState(id, { validation, value: null, helpText });
    }
  }

  handleClick() {
    const data = {};
    Object.keys(this.state.data).forEach((key) => {
      data[key] = this.state.data[key].value;
    });
    this.props.login(this.state.route, data);
  }

  render() {
    const userNameHelp = this.state.data.username.helpText;
    const passwordHelp = this.state.data.pass.helpText;
    return (
      <form>
        <FormGroup controlId="username" validationState={this.state.data.username.validation}>
          <TextInput
            type={'text'}
            label={'User Name'}
            placeholder={'User Name'}
            requiresValidation={true}
            updateVals={this.updateVals}
          />
          <FormControl.Feedback />
          <HelpBlock>
            <Alert bsStyle="danger" hidden={!userNameHelp}>
              {userNameHelp}
            </Alert>
          </HelpBlock>
        </FormGroup>

        <FormGroup controlId="pass" validationState={this.state.data.pass.validation}>
          <TextInput
            type={'password'}
            label={'Password'}
            placeholder={'Password'}
            requiresValidation={true}
            updateVals={this.updateVals}
          />
          <FormControl.Feedback />
          <HelpBlock>
            <Alert bsStyle="danger" hidden={!passwordHelp}>
              {passwordHelp}
            </Alert>
          </HelpBlock>
        </FormGroup>

        <FormGroup controlId="firstName" validationState={this.state.data.firstName.validation}>
          <TextInput
            type={'text'}
            label={'firstName'}
            placeholder={'First Name'}
            requiresValidation={true}
            updateVals={this.updateVals}
          />
        </FormGroup>

        <FormGroup controlId="lastName" validationState={this.state.data.lastName.validation}>
          <TextInput
            type={'text'}
            label={'lastName'}
            placeholder={'Last Name'}
            requiresValidation={true}
            updateVals={this.updateVals}
          />
        </FormGroup>

        <FormGroup controlId="dateOfBirth" validationState={this.state.data.dateOfBirth.validation}>
          <TextInput
            type={'date'}
            label={'dob'}
            placeholder={'Date of birth'}
            requiresValidation={true}
            updateVals={this.updateVals}
          />
        </FormGroup>

        <FormGroup controlId="email" validationState={this.state.data.email.validation}>
          <TextInput
            type={'email'}
            label={'email'}
            placeholder={'E-mail Address'}
            requiresValidation={true}
            updateVals={this.updateVals}
          />
        </FormGroup>

        <Button
          bsStyle="success"
          style={{ width: '100%' }}
          onClick={this.handleClick}
          disabled={this.state.isDisabled}
        >
          Sign Up
        </Button>
      </form>
    );
  }
}
