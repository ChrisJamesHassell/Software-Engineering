import React from 'react';
import { FormControl } from 'react-bootstrap';

export default class TextInput extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.handleChange = this.handleChange.bind(this);

        this.state = {
            value: '',
            requiresValidation: false,
        };
    }

    componentDidMount() {
        // If the input requires validation, reflect in the state
        this.props.requiresValidation &&
            this.setState({ requiresValidation: true });
    }

    handleChange(e) {
        this.setState({ value: e.target.value });
        this.props.updateVals(e.target.id, e.target.value);
    }

    render() {
        return (
            <FormControl
                type={this.props.type}
                name={this.props.name}
                label={this.props.label}
                required={this.props.required}
                pattern={this.props.pattern}
                autoComplete={'current-password'}
                maxLength={this.props.maxLength || 32}
                placeholder={this.props.placeholder}
                onChange={this.handleChange}
                value={this.state.value}
            />
        );
    }
}
