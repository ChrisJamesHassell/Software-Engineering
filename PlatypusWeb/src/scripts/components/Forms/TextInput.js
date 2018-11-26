import React from 'react';
import { FormControl } from 'react-bootstrap';

export default class TextInput extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.handleChange = this.handleChange.bind(this);

        this.state = {
            value: '',
            requiresValidation: false
        };
    }

    componentDidMount() {
        // If the input requires validation, reflect in the state
        this.props.requiresValidation && this.setState({ requiresValidation: true });
    }

    handleChange(e) {
        this.setState({ value: e.target.value });

        // If it requires validation, then set the validation state
        this.state.requiresValidation && this.props.getValidationState(e.target.id, e.target.value);
    }

    render() {
        return (
            <FormControl
                type={this.props.type}
                value={this.state.value}
                placeholder={this.props.placeholder}
                onChange={this.handleChange}
            />
        );
    }
}