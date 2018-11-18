import React from 'react';
import { Modal, Button, Form, Col, ControlLabel, FormGroup, FormControl, Checkbox } from 'react-bootstrap';
import moment from 'moment';

const categoryOptions = [
    { label: 'Appliances', value: 'APPLIANCES' },
    { label: 'Auto', value: 'AUTO' },
    { label: 'Meals', value: 'MEALS' },
    { label: 'Medical', value: 'MEDICAL' },
    { label: 'Miscellaneous', value: 'MISCELLANEOUS' },
];

export default class EventForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: Math.floor(Math.random() * 100) + 20,
            name: 'New Event Hurr',
            category: 'APPLIANCES',
            description: '',
            notification: '',
            startDate: '',
            endDate: '',
            location: '',
            pinned: 1
        }
    }

    handleSubmit = () => {
        const start = moment(this.props.data.start).add(2, 'hours');
        const end = moment(this.props.data.end).add(2, 'hours');
        const thing = {
            id: Math.floor(Math.random() * 100) + 20,
            title: 'Team lead meeting',
            start: start, //moment(start).format('YYYY-MM-DD'),
            end: end, //moment(end).format('YYYY-MM-DD'),
            resourceId: 3,
            isSelf: true,
        }
        this.props.addEvent(thing);
    }
    render() {
        return (
            <Modal show={this.props.visible} onHide={this.props.onHideModal} style={{ width: '100%' }}>
                <Modal.Header closeButton>
                    <Modal.Title>Create Event</Modal.Title>
                </Modal.Header>
                <Form horizontal style={{ width: '100%', padding: '2em' }}>
                    <FormGroup controlId="eventName">
                        <Col componentClass={ControlLabel} sm={2}>
                            Name
                        </Col>
                        <Col sm={10}>
                            <FormControl type="text" placeholder="Title of the event..." />
                        </Col>
                    </FormGroup>

                    <FormGroup controlId="eventCategory">
                        <Col componentClass={ControlLabel} sm={2}>Category</Col>
                        <Col sm={10}>
                            <FormControl componentClass="select" placeholder="Select a category...">
                                {categoryOptions.map((category) => {
                                    return <option key={category.label} value={category.value}>{category.label}</option>
                                })}
                            </FormControl>
                        </Col>
                    </FormGroup>
                </Form>
                <Button onClick={this.handleSubmit}>Submit</Button><Button onClick={this.props.handleClose}>Close</Button>
            </Modal>
        )
    }
}