import React from 'react';
import { FormGroup, Button, FormControl, HelpBlock, Alert } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import {Dashboard} from '../Pages/Dashboard';
import TextInput from './TextInput';

// This is required to match correctly
const regex = {
    'userName': /^(?=.*[a-zA-Z])[A-Za-z\d]{8,32}$/g,
    'userPassword': /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,32}$/g
}

const path = window.location.origin.toLowerCase().includes('platypus') ? '' : 'http://localhost:8080';

const fakeAuth = {
    isAuthenticated: false,
    authenticate(cb) {
      this.isAuthenticated = true;
      setTimeout(cb, 100); // fake async
    },
    signout(cb) {
      this.isAuthenticated = false;
      setTimeout(cb, 100);
    }
  };

const AuthButton = withRouter(
    ({ history }) =>
      fakeAuth.isAuthenticated ? (
        <p>
          Welcome!{" "}
          <button
            onClick={() => {
              fakeAuth.signout(() => history.push("/"));
            }}
          >
            Sign out
          </button>
        </p>
      ) : (
        <p>You are not logged in.</p>
      )
  );


function readResponseAsJSON(response) {
    return response.json();
}

function fetchJSON(pathToResource, validateResponse, logError, handleJsonResponse, optional) {
    fetch(pathToResource, optional)
        .then(validateResponse) // if not valid, skips rest and goes to catch
        .then(readResponseAsJSON)
        .then(handleJsonResponse)
        .catch(logError);
}

export default class LoginForm extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            id: null,
            isDisabled: true,
            items: null,
            route: path + '/user/login/',
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
        this.validateResponse = this.validateResponse.bind(this);
        this.logError = this.logError.bind(this);
        this.handleJsonResponse = this.handleJsonResponse.bind(this);
        this.submit = React.createRef();
    }

    componentDidMount() { }

    componentDidUpdate(prevProps, nextProps) {
        var stateChanged = JSON.stringify(nextProps) !== JSON.stringify(this.state);
        if (stateChanged) {
            var formValid = this.state['userName'].validation === 'success' && this.state['userPassword'].validation === 'success';
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

    getRequestString() {
        // return this.state.route + this.state['userName'].value + '/' + this.state['userPassword'].value;
        return this.state.route; //+ this.state['userName'].value + '/' + this.state['userPassword'].value;
    }

    handleClick(e) {
        // THIS IS ALL TEMPORARY SHIT
        var request = this.getRequestString();

        /*var req = new Request(request, {
            method: 'POST',
            credentials: 'include',
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                'username': this.state['userName'].value,
                'password': this.state['userPassword'].value
            })
        });*/

        // console.log(e.target);
        var opts = {
            method: 'POST',
            credentials: 'include',
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                'username': this.state['userName'].value,
                'password': this.state['userPassword'].value
            })
        };

        fetchJSON(request, this.validateResponse, this.logError, this.handleJsonResponse, opts);

    }

    validateResponse(result) {
        this.setState({ isLoaded: true });
        if (!result.ok) {
            throw Error(result.statusText);
        }
        else {
            console.log("shit be fiiiiiiiiiine")
        }
        return result;

    }

    handleJsonResponse(response) {
        console.log("got to 'handleresponse'");
        console.log(response);
        this.setState({ items: response });
        console.log('after the fetch. doc.cookie: ', document.cookie);
        if(document.cookie) this.props.authenticate(document.cookie);
    }

    logError(error) {
        console.log("THEY BE AN ERRRRR");
        console.log(error);
        var thing = JSON.stringify(error);

        console.log(thing);
        this.setState({ error: error })
    }


    render() {
        var userNameHelp = this.state['userName'].helpText;
        var passwordHelp = this.state['userPassword'].helpText;
        console.log("**~***~* LOGINFORM: ~*~*~");
        console.log(this.props);
        return (
            <form action={this.state.route} method="POST">
                <FormGroup
                    controlId="userName"
                    validationState={this.state['userName'].validation}
                >
                    <TextInput
                        type={'text'}
                        name={'username'}
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
                        name={'password'}
                        label={'Password'}
                        placeholder={'Enter your password'}
                        requiresValidation={true}
                        getValidationState={this.getValidationState} />
                    <FormControl.Feedback />
                    <HelpBlock><Alert bsStyle="danger" hidden={!passwordHelp}>{passwordHelp}</Alert></HelpBlock>
                </FormGroup>
                <Button ref={this.submit} bsStyle='success' style={{ width: '100%' }} onClick={this.handleClick.bind(this)} disabled={this.state.isDisabled}>Login</Button>
            </form>
        );
    }
}