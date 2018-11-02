import React from 'react';
import { FormGroup, Button, Glyphicon, InputGroup } from 'react-bootstrap';
import TextInput from './TextInput';
import { path } from '../../fetchHelpers';

export default class LoginForm extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            route: path + '/user/login',
            data: {
                username: '',
                pass: '',
            },
            response: {},
            isSuccess: false,
        };
        this.updateVals = this.updateVals.bind(this);
    }

    updateVals(id, value) {
        value.length < 1 && this.props.clearErrorAlert(); // clear error alert if field is cleared
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
            <form
                action={this.state.route}
                method="POST"
                encType="multipart/form-data"
                onKeyUp={ev => ev.keyCode === 13 && this.handleClick()}
            >
                <FormGroup controlId="username">
                    <InputGroup>
                        <InputGroup.Addon>
                            <Glyphicon glyph="user" />
                        </InputGroup.Addon>
                        <TextInput
                            type={'text'}
                            name={'username'}
                            label={'User Name'}
                            required={true}
                            maxLength={'32'}
                            placeholder={'Enter your user name'}
                            updateVals={this.updateVals}
                        />
                    </InputGroup>
                </FormGroup>

                <FormGroup controlId="pass">
                    <InputGroup>
                        <InputGroup.Addon>
                            <Glyphicon glyph="lock" />
                        </InputGroup.Addon>
                        <TextInput
                            type={'password'}
                            name={'password'}
                            label={'Password'}
                            required={true}
                            maxLength={'32'}
                            placeholder={'Enter your password'}
                            updateVals={this.updateVals}
                        />
                    </InputGroup>
                </FormGroup>
                <Button
                    type="button"
                    bsStyle="success"
                    style={{ width: '100%' }}
                    onClick={this.handleClick.bind(this)}
                    disabled={
                        this.state.data.username.length < 1 ||
                        this.state.data.pass.length < 1
                    }
                >
                    Login
                </Button>
            </form>
        );
    }
}
