import React from 'react';
import { Checkbox, Glyphicon } from 'react-bootstrap';
import { path } from '../../fetchHelpers';

export default class CustomCheckbox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            item: {}
        }
        this.handleCheckbox = this.handleCheckbox.bind(this);
    }

    componentDidMount() {
        this.setState({ item: this.props.original })
    }

    handleCheckbox(e, values) {
        this.props.toggleSelection(e.target.checked, this.props.index, values);
    }
    render() {
        return (
            <Checkbox
                key={this.props.key}
                className="cb"
                style={{ background: this.props.style.background, transition: 'background .25s' }}
                inputRef={ref => { this.input = ref; }}
                onClick={e => this.handleCheckbox(e, this.props.original)}>
                <Glyphicon
                    className="cb-check"
                    glyph="ok"
                    style={{ color: 'white', fontSize: this.props.style.fontSize, transition: 'font-size .5s' }} />
            </Checkbox>
        )
    }
}