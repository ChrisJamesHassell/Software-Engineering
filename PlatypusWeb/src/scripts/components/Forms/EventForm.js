import React from 'react';
import { Modal, Button, Form, Col, ControlLabel, FormGroup, FormControl, Checkbox, Glyphicon } from 'react-bootstrap';
import moment from 'moment';
import {getRandomId} from '../../fetchHelpers';

const categoryOptions = [
    { label: 'Appliances', value: 'APPLIANCES' },
    { label: 'Auto', value: 'AUTO' },
    { label: 'Meals', value: 'MEALS' },
    { label: 'Medical', value: 'MEDICAL' },
    { label: 'Miscellaneous', value: 'MISCELLANEOUS' },
];

// Calendar requires the fields: id, title, start, end
const fieldMap = {
    name: 'title',
    startDate: 'start',
    endDate: 'end'
}

const defaultVals = {
    id: 0,
    title: '',
    start: null,
    end: null,
    isSelf: true,
    data: {
        name: '',
        category: 'APPLIANCES',
        description: '',
        notification: '',
        startDate: '',
        endDate: '',
        location: '',
        pinned: 0
    }
}



// ======================================================= //
//  EVENTFORM
// ======================================================= //
export default class EventForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = defaultVals;
    }

    componentDidMount = (props) => {
        this.setState({ id: getRandomId(this.props.events) });
        
        // This is to load the existing values for editing an event
        // Object.keys(defaultVals.data).forEach(key => {
        //     this.props[key] && this.setState({ data: { ...this.state.data, [key]: this.props[key] } })
        // });
    }

    handleChange = (e) => {
        let { id, value } = e;
        let stateIndex = fieldMap[id];
        if (['name', 'startDate', 'endDate'].includes(id)) {
            this.setState({ [stateIndex]: value })
        }
        this.setState({ data: { ...this.state.data, [id]: value } })
    }

    handleCheck = (e) => {
        this.setState({ data: { ...this.state.data, pinned: e.checked } });
    }

    handleSubmit = () => {
        const startDate = this.state.start || this.props.data.start;
        const endDate = this.state.end || this.props.data.end;

        const start = moment(startDate).add(2, 'hours').format('YYYY-MM-DD hh:mm');
        const end = moment(endDate).add(2, 'hours').format('YYYY-MM-DD hh:mm');

        const event = Object.assign(
            {},
            { ...this.state },
            { start },
            { end },
            {
                data: {
                    ...this.state.data,
                    startDate: moment(start).format('YYYY-MM-DD'),
                    endDate: moment(end).format('YYYY-MM-DD')
                }
            }
        )

        this.setState({ ...defaultVals }); // Clears the form
        this.props.addEvent(event);
    }

    render() {
        let start = this.state.data.startDate || moment(this.props.data.start).format('YYYY-MM-DD');
        let end = this.state.data.endDate || moment(this.props.data.end).format('YYYY-MM-DD')

        return (
            <Modal show={this.props.visible} onHide={this.props.handleClose} style={{ width: '100%' }}>
                <Modal.Header closeButton>
                    <Modal.Title>{this.props.modal} Event</Modal.Title>
                </Modal.Header>
                <Form horizontal style={{ width: '100%', padding: '2em' }}>
                    <FormGroup controlId="name">
                        <Col componentClass={ControlLabel} sm={3}>Name</Col>
                        <Col sm={9}>
                            <FormControl
                                type="text"
                                placeholder="Name of the event..."
                                value={this.state.data.name}
                                onChange={e => this.handleChange(e.target)}
                            />
                        </Col>
                    </FormGroup>

                    <FormGroup controlId="category">
                        <Col componentClass={ControlLabel} sm={3}>Category</Col>
                        <Col sm={9}>
                            <FormControl
                                componentClass="select"
                                placeholder="Select a category..."
                                value={this.state.data.category}
                                onChange={e => this.handleChange(e.target)}
                            >
                                {categoryOptions.map((category) => {
                                    return <option key={category.label} value={category.value}>{category.label}</option>
                                })}
                            </FormControl>
                        </Col>
                    </FormGroup>

                    <FormGroup controlId="description">
                        <Col componentClass={ControlLabel} sm={3}>Description</Col>
                        <Col sm={9}>
                            <FormControl
                                type="text"
                                placeholder=""
                                value={this.state.data.description}
                                onChange={e => this.handleChange(e.target)}
                            />
                        </Col>
                    </FormGroup>

                    <FormGroup controlId="notification">
                        <Col componentClass={ControlLabel} sm={3}>Notification</Col>
                        <Col sm={9}>
                            <FormControl
                                type="date"
                                placeholder={Date.now()}
                                value={this.state.data.notification}
                                onChange={e => this.handleChange(e.target)}
                            />
                        </Col>
                    </FormGroup>

                    <FormGroup controlId="startDate">
                        <Col componentClass={ControlLabel} sm={3}>Start Date</Col>
                        <Col sm={9}>
                            <FormControl
                                type="date"
                                value={this.state.data.startDate || start}
                                onChange={e => this.handleChange(e.target)}
                            />
                        </Col>
                    </FormGroup>

                    <FormGroup controlId="endDate">
                        <Col componentClass={ControlLabel} sm={3}>End Date</Col>
                        <Col sm={9}>
                            <FormControl
                                type="date"
                                value={this.state.data.endDate || end}
                                onChange={e => this.handleChange(e.target)}
                            />
                        </Col>
                    </FormGroup>

                    <FormGroup controlId="location">
                        <Col componentClass={ControlLabel} sm={3}>Location</Col>
                        <Col sm={9}>
                            <FormControl
                                type="text"
                                placeholder=""
                                value={this.state.data.location}
                                onChange={e => this.handleChange(e.target)}
                            />
                        </Col>
                    </FormGroup>

                    <FormGroup controlId="pinned">
                        <Col componentClass={ControlLabel} sm={3}>Pinned</Col>
                        <Col sm={9}>
                            <Checkbox
                                className="cb"
                                style={{ background: this.state.data.pinned ? '#18bc9c' : '#eee' }}
                                checked={this.state.data.pinned}
                                onChange={e => this.handleCheck(e.target)}>
                                <Glyphicon
                                    className="cb-check"
                                    glyph="ok"
                                    style={{ color: 'white', fontSize: this.state.data.pinned ? '15px' : '0', transition: 'font-size .5s', top: '-5px' }}
                                />
                            </Checkbox>
                        </Col>
                    </FormGroup>
                </Form>
                <Button onClick={this.handleSubmit}>Submit</Button><Button onClick={this.props.handleClose}>Close</Button>
            </Modal>
        )
    }
}