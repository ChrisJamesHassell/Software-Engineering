import React from 'react';
import { Checkbox, Glyphicon } from 'react-bootstrap';

export default class CustomCheckbox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            checkVisible: 'none',
            checkBg: '#eee',
            size: '0'
        }
        this.handleCheckbox = this.handleCheckbox.bind(this);
    }

    handleCheckbox(e) {
        const bg = e.target.checked ? '#18bc9c' : '#eee';
        if (e.target.checked) this.setState({ checkBg: '#18bc9c', checkVisible: 'block', size: '15px' })
        else this.setState({ checkBg: '#eee', checkVisible: 'none', size: '0' })
    }
    render() {
        return (
            <Checkbox
                key={this.props.key}
                className="cb"
                style={{ background: this.state.checkBg, transition: 'background .5s' }}
                inputRef={ref => { this.input = ref; }}
                onClick={e => this.handleCheckbox(e)}>
                <Glyphicon
                    className="cb-check"
                    glyph="ok"
                    style={{ color: 'white', fontSize: this.state.size, transition: 'font-size .5s' }} />
            </Checkbox>
        )
    }
}