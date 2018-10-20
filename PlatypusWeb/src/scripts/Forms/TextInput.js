import React from 'react';
import { FormControl } from 'react-bootstrap';

export default class TextInput extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.handleChange = this.handleChange.bind(this);

        this.state = {
            value: ''
        };
    }

    handleChange(e) {
        this.setState({ value: e.target.value });
        console.log('val: ', e.target.value);
        console.log('leng: ', e.target.value.length);
        var validation = null;
        if(e.target.value.length < 1) validation = '';
        else if (e.target.value.length < 33 && e.target.value.length > 9) {
            validation = 'success';
        }
        else {
            validation = 'error';
        }
        this.props.setValidationState(e.target.id, validation);
    }

    render() {
        return (
            <FormControl
                type="text"
                value={this.state.value}
                placeholder={this.props.placeholder}
                onChange={this.handleChange}
            />
        );
    }
}