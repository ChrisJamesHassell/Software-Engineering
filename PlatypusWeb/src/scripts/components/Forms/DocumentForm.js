import React from 'react';
import moment from 'moment';
import qs from 'qs';
import { Modal, FormGroup, Col, Checkbox, Glyphicon, Button, Form, FormControl, ControlLabel, HelpBlock, Panel, ButtonToolbar } from 'react-bootstrap';
import ReactTable from 'react-table';
import 'react-table/react-table.css'
import { DashBox, DashBoxHeader } from '../Pages/DashPage';
import { path, categories, filterProps, categoryOptions, categoryColor, catMap } from '../../fetchHelpers';

const defaultVals = {
    category: '',
    description: '',
    documentID: '',
    expirationDate: '',
    name: '',
    pinned: 0
}

function FieldGroup({ id, label, help, ...props }) {
    return (
        <FormGroup controlId={id}>
            <ControlLabel>{label}</ControlLabel>
            <FormControl {...props} />
            {help && <HelpBlock>{help}</HelpBlock>}
        </FormGroup>
    );
}


export default class DocumentForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: defaultVals,
        };
    }

    handleChange = (e) => {
        this.setState({ data: { ...this.state.data, [e.id]: e.value } });
    }

    handleDelete = () => { //userID, fileName, documentID
        const request = {
            userID: localStorage.getItem('userId'),
            document: {
                fileName: this.state.data.fileName,
                documentID: this.state.data.documentID
            }
        }
        this.setState({ ...defaultVals }); // Clears the form
        this.props.onDelete(request);
    }

    onClose = () => {
        this.setState({ ...defaultVals }); // Clears the form
        this.props.handleClose();
    }

    render() {
        const isCreate = this.props.modal === 'Create';
        const url = `${path}/app/${this.props.itemType}/add`;
        let actionUrl = '';
        let encType = '';
        let method = '';
        let buttonType = 'button';
        if (isCreate) {
            actionUrl = url;
            encType = "multipart/form-data";
            method = "post";
            buttonType = "submit";
        }
        let thing = {
            Name: {
                type: 'text',
                placeholder: 'Name of the document...',
                name: 'name',
                required: true
            }
        }
        return (
            <Modal show={this.props.show} onHide={this.props.handleClose}>
                <div>
                    <Form horizontal action={actionUrl} method={method} encType={encType} style={{ width: '100%', padding: '2em' }} >
                        <input type="hidden" name="userID" value={localStorage.getItem('userId')} />
                        <input type="hidden" name="groupID" value={localStorage.getItem('selfGroupId')} />
                        <FormGroup controlId="name">
                            <Col componentClass={ControlLabel} sm={3}>Name</Col>
                            <Col sm={9}>
                                <FormControl
                                    type="text"
                                    placeholder="Name of the document..."
                                    name="name"
                                    required
                                />
                            </Col>
                        </FormGroup>

                        <FormGroup controlId="category">
                            <Col componentClass={ControlLabel} sm={3}>Category</Col>
                            <Col sm={9}>
                                <FormControl
                                    componentClass="select"
                                    name="category"
                                    required
                                    readOnly={this.props.category ? true : false}
                                    value={this.props.category}
                                >
                                    {(this.props.category && <option value={catMap[this.props.category]}>{this.props.category}</option>) ||
                                        categoryOptions.map((category) => {
                                            return <option key={category.label} value={category.label}>{category.label}</option>
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
                                    name="description"
                                />
                            </Col>
                        </FormGroup>

                        <FormGroup controlId="expirationDate">
                            <Col componentClass={ControlLabel} sm={3}>Expiration Date</Col>
                            <Col sm={9}>
                                <FormControl
                                    type="date"
                                    name="expirationDate"
                                />
                            </Col>
                        </FormGroup>

                        <FormGroup controlId="pinned">
                            <Col componentClass={ControlLabel} sm={3}>Pinned</Col>
                            <Col sm={9}>
                                <FormControl
                                    componentClass="select"
                                    name="pinned"
                                    required
                                >
                                    <option value={1}>true</option>
                                    <option value={0}>false</option>
                                </FormControl>
                            </Col>
                        </FormGroup>

                        <FormGroup controlId="FILE">
                            <Col componentClass={ControlLabel} sm={3}>File</Col>
                            <Col sm={9}>
                                <input type="file" name="FILE" accept="image/*" required />
                            </Col>
                        </FormGroup>

                        <Button type={buttonType}>SUBMIT</Button>
                        <Button bsStyle="danger">DELETE</Button>
                    </Form>
                </div>
            </Modal >
        )
    }
}