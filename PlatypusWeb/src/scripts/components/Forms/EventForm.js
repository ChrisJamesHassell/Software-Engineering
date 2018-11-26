import React from 'react';
import { Modal, Button, Form, Col, ControlLabel, FormGroup, FormControl, Checkbox, Glyphicon } from 'react-bootstrap';
import moment from 'moment';
import { getRandomId, categoryOptions } from '../../fetchHelpers';

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
    initialLoaded: false,
    data: {
        name: '',
        category: '',
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

    componentDidMount = () => {
        this.setState({ id: getRandomId(this.props.events) });
    }

    static getDerivedStateFromProps = (nextProps, prevState) => {
        if (!prevState.initialLoaded) {
            if (nextProps.visible) return { initialLoaded: true, data: { ...nextProps.data.data } };
            else return defaultVals;
        }
        return null;
    }

    handleChange = (e) => {
        let { id, value } = e;
        let stateIndex = fieldMap[id];

        if (['name', 'startDate', 'endDate'].includes(id)) this.setState({ [stateIndex]: value });
        this.setState(Object.assign({ data: {} }, { data: { ...this.state.data, [id]: value } }))
    }

    handleCheck = (e) => {
        this.setState({ data: { ...this.state.data, pinned: e.checked ? 1 : 0 } });
    }

    handleDelete = () => {
        const request = { event: { eventID: this.state.data.eventID } };
        this.setState({ ...defaultVals }); // Clears the form
        this.props.onDelete(request);
    }

    handleSubmit = () => {
        const startDate = this.state.start || this.props.data.start;
        const endDate = this.state.end || this.props.data.end;
        const startHour = moment(startDate).hour();
        const endHour = moment(endDate).hour();

        const start = startHour === 0 ? moment(startDate).add(2, 'hours').toDate() : moment(startDate).toDate();
        const end = endHour === 0 ? moment(endDate).add(2, 'hours').toDate() : moment(endDate).toDate();
        const data = {
            ...this.state.data,
            notification: this.state.data.notification ? moment(this.state.data.notification).format('MMM DD, YYYY') : null,
            startDate: moment(start).format('MMM DD, YYYY'),
            endDate: moment(end).format('MMM DD, YYYY'),
        };
        let event = {};
        if (this.props.modal === 'Create') {
            event = Object.assign(
                {},
                { ...this.state },
                { start },
                { end },
                { data: data }
            )
        }
        else event = data;

        this.onClose();
        this.props.handleSubmission(event, this.props.modal);
    }

    onClose = () => {
        this.setState({ ...defaultVals }); // Clears the form
        this.props.handleClose();
    }

    render() {
        let start = this.state.data.startDate || moment(this.props.data.start).format('YYYY-MM-DD');
        let end = this.state.data.endDate || moment(this.props.data.end).format('YYYY-MM-DD');

        return (
            <Modal show={this.props.visible} onHide={this.onClose} style={{ width: '100%' }}>
                <Modal.Header style={{ background: this.props.modal === 'Edit' ? '#f5c900' : '#18bc9c', color: 'white' }} closeButton>
                    <Modal.Title>{this.props.modal} Event</Modal.Title>
                </Modal.Header>
                <Form horizontal style={{ width: '100%', padding: '2em' }}>
                    <FormGroup controlId="name">
                        <Col componentClass={ControlLabel} sm={3}>Name</Col>
                        <Col sm={9}>
                            <FormControl
                                type="text"
                                placeholder="Name of the event..."
                                value={this.state.data.name || ''}
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
                                value={this.state.data.description || ''}
                                onChange={e => this.handleChange(e.target)}
                            />
                        </Col>
                    </FormGroup>

                    <FormGroup controlId="notification">
                        <Col componentClass={ControlLabel} sm={3}>Notification</Col>
                        <Col sm={9}>
                            <FormControl
                                type="date"
                                value={this.state.data.notification || ''}
                                onChange={e => this.handleChange(e.target)}
                            />
                        </Col>
                    </FormGroup>

                    <FormGroup controlId="startDate">
                        <Col componentClass={ControlLabel} sm={3}>Start Date</Col>
                        <Col sm={9}>
                            <FormControl
                                type="date"
                                value={start}
                                onChange={e => this.handleChange(e.target)}
                            />
                        </Col>
                    </FormGroup>

                    <FormGroup controlId="endDate">
                        <Col componentClass={ControlLabel} sm={3}>End Date</Col>
                        <Col sm={9}>
                            <FormControl
                                type="date"
                                value={end}
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
                                value={this.state.data.location || ''}
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
                                checked={this.state.data.pinned || 0}
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
                <Modal.Footer>
                    <Button onClick={this.handleSubmit}><b>SUBMIT</b></Button>
                    <Button onClick={this.onClose}><b>CLOSE</b></Button>
                    {this.props.modal === 'Edit' && <Button bsStyle="danger" onClick={this.handleDelete}><b>DELETE</b></Button>}
                </Modal.Footer>

            </Modal>
        )
    }
}