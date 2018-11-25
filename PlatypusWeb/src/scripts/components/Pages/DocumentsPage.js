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


class DocumentForm extends React.Component {
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

// =============================================================== //
//  DOCUMENT
// =============================================================== //
export default class Document extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            itemType: 'doc',
            overdue: [],
            show: false,
            loading: false,
        }
    }
    componentDidMount() {
        const url = `${path}/app/${this.props.itemType}?${qs.stringify({
            category: 'null',
            groupID: localStorage.getItem('selfGroupId'),
            pinned: 'null',
            userID: localStorage.getItem('userId'),
            weeksAhead: -1,
        })}`;

        this.setState({ method: 'GET' });
        this.fetchRequest(url, 'GET', null);
    }

    // === FETCHREQUEST === //
    fetchRequest = async (url, method, body, isEdit = false) => {
        this.setState({ isLoaded: false });
        let options = {
            method: method,
            credentials: 'include'
        }
        if (body) options['body'] = JSON.stringify(body);

        await fetch(url, options)
            .then(response => this.validateResponse(response))
            .then(validResponse => validResponse.json())
            .then(jsonResponse => this.handleJsonResponse(jsonResponse, isEdit))
    }

    getFormattedDate = (date) => {
        if (date) return moment(date).format('MMM DD, YYYY');
        return null;
    }

    // === GETFORMATTEDITEMS === //
    getFormattedItem(values) {
        let itemType = 'document';
        let imgUrl = `${path}/app/doc/download?docID=`;
        let item = {
            group: { groupID: localStorage.getItem('selfGroupId') },
            [itemType]: {
                name: values.name,
                category: values.category,
                description: values.description || '',
                pinned: values.pinned ? 1 : 0,
            }
        }
        item[itemType].expirationDate = this.getFormattedDate(values.expiration);
        item[itemType].documentID = values.documentID || values.itemID;
        item[itemType].fileName = values.fileName;
        item[itemType].imgUrl = imgUrl + (values.documentID || values.itemID);

        // console.log("FORMATTED ITEM: ", item);
        return item;
    }

    // === GETITEMCOLS === //
    getItemCols = () => {
        return [
            {
                Header: '',
                id: 'documentID',
                accessor: d => d.documentID,
                Cell: props => {
                    return (
                        <div>
                            <ButtonToolbar>
                                <Button style={{ background: 'transparent', border: 'none' }} onClick={e => { this.onEdit(props) }}><Glyphicon glyph="pencil" style={{ color: "#18bc9c" }} /></Button>
                                <Button style={{ background: 'transparent', border: 'none' }} onClick={e => { this.onDelete(props) }}><Glyphicon glyph="trash" style={{ color: "#e74c3c" }} /></Button>
                            </ButtonToolbar>
                        </div>
                    )
                }
            },
            {
                Header: 'Name',
                id: 'name',
                accessor: d => d.name,
            },
            {
                Header: 'Category',
                id: 'category',
                accessor: d => d.category,
            },
            {
                Header: 'Expiration Date',
                id: 'expirationDate',
                accessor: d => d.expirationDate,
                Cell: props => {
                    const overdue = Math.floor((moment.duration(moment().diff(props.value))).asDays());
                    const multiple = overdue > 1 ? 's' : '';
                    return <div>{props.value && moment(props.value).format('MMM DD, YYYY')}
                        {overdue > 0 && <div style={{ color: props.original.completed ? '#c8d2d0' : '#e74c3c', fontSize: '.8em' }}>{overdue} day{multiple} overdue</div>}
                    </div>
                }
            },
            {
                Header: 'Download',
                id: 'documentID',
                accessor: d => d.documentID,
                Cell: props => {
                    const url = `${path}/app/doc/download?${qs.stringify({
                        docID: props.value
                    })}`;
                    return (
                        <div>
                            <a href={url} download={props.original.name}><Glyphicon glyph="download" style={{ fontSize: '2em', color: '#18bc9c' }} /></a>
                        </div>
                    )
                }
            },
            {
                Header: '',
                id: 'imgUrl',
                accessor: d => d.imgUrl,
                Cell: props => {
                    const style = {
                        background: '#18bc9c',
                        border: '0',
                        fontSize: '.8em',
                        borderRadius: '25px'
                    }
                    return (
                        <div>
                            <Button style={style} href={props.value}>
                                {/* <Glyphicon glyph="eye-open" /> */}<b>PREVIEW</b>
                            </Button>
                        </div>
                    )
                }
            },
        ]
    }

    // === HANDLECLOSE === //
    handleClose = () => {
        this.setState({ show: false })
    }

    // === HANDLEEDIT === //
    handleEdit = (itemType, isDelete = false) => {
        this.setState({ loading: true });
        console.log("HANDLE EDIT (isdelete?): ", isDelete);
        
        let editedIndex = this.state.rowIndex;
        console.log("EDITEDINDEX: ", editedIndex);
        let items = Object.assign([], this.state.items);

        if (isDelete) { // For DELETION
            return items.filter(item => item.documentID !== itemType);
        }

        else { // For MODIFY
            this.state.events.forEach((i, index) => { if (i.id === itemType.id) editedIndex = index; });
            items[editedIndex] = itemType;
        }
        return items;
    }

    // === HANDLEJSONRESPONSE === //
    handleJsonResponse(response, isEdit = false) {
        console.log("RESPONSE: ", response);
        let { data: item } = response;
        let items = Object.assign([], this.state.items);

        if (this.state.method === 'GET') {
            this.setState({ method: '' });
            if (item.length > 0) {
                item.forEach(i => {
                    items.push(this.getFormattedItem(i.document).document)
                })
            }
            else items = [];
        }

        else { // Otherwise it's an EDIT or a DELETE
            this.setState({ method: '' });
            const formattedItem = this.getFormattedItem(item).document;
            if (isEdit) {
                if (response.message.includes('delete')) items = Object.assign([], this.handleEdit(this.state.documentID, true));
                else items = this.handleEdit(formattedItem);
                // items[this.state.rowIndex] = formattedItem;
            }
            else items = [...this.state.items, formattedItem]; // ADDing a document
        }

        console.log("===============HANDLEJSON (ITEMS) ========================")
        console.log("ITEMS: ", items);
        this.setState({ items });
    }

    // === HANDLEOVERDUESTATE === //
    handleOverdueState = (item, dateKey) => {
        const idKey = this.state.itemType + 'ID'; //eventID, taskID
        const overdue = Math.floor((moment.duration(moment().diff(item[dateKey]))).asDays()) || 0;
        const overdues = this.state.overdue.filter(od => od[idKey] !== item[idKey]);
        let newOverdues = [];
        if (overdue > 0 && item.pinned && !item.completed) newOverdues = [...overdues, item];
        else newOverdues = this.state.overdue.filter(od => od[idKey] !== item[idKey]);

        this.setState({ overdue: newOverdues });
        this.setState({ itemTypeBg: newOverdues.length > 0 ? '#e74c3c' : '#b4bfbd' })
    }

    // === ONCREATE === //
    onCreate = () => {
        this.setState({ show: true, modal: 'Create' });
    }

    // === ONEDIT === //
    onEdit = (props) => {
        console.log("EDIT PROPS: ", props);
        this.setState({ show: true, modal: 'Edit' });
    }

    // === ONDELETE === //
    onDelete = (props) => {
        const request = {
            userID: localStorage.getItem('userId'),
            document: {
                fileName: props.original.fileName,
                documentID: props.original.documentID
            }
        };
        this.setState({ method: 'POST', documentID: props.original.documentID, rowIndex: props.index });
        const url = `${path}/app/doc/delete`;
        this.fetchRequest(url, 'POST', request, true);
        this.handleClose();
    }

    // === VALIDATERESPONSE === //
    validateResponse = (result) => {
        this.setState({ loading: false });
        if (!result.ok) throw Error(result.statusText);
        else return result;
    }
    render() {
        return (
            <div>
                <div id='page-container'>
                    <DocumentForm {...this.state} {...this.props}
                        show={this.state.show}
                        onDelete={this.onDelete}
                        onCreate={this.onCreate}
                        handleClose={this.handleClose}
                    />

                    <Panel className='dash-panel'>
                        <Panel.Heading style={{ background: '#33363b' }}>
                            <DashBoxHeader
                                category={'documents'}
                                options={() => <Button bsStyle="success" style={{ borderRadius: '15px' }} onClick={this.onCreate}><Glyphicon style={{ fontSize: '1.1em', paddingRight: '5px', paddingTop: '2px' }} glyph="plus-sign" /><b>UPLOAD</b></Button>} />
                        </Panel.Heading>
                        <Panel.Body>
                            <ReactTable
                                className="-highlight"
                                defaultPageSize={10}
                                data={this.state.items}
                                // resolveData={data => data.map(row => row)}
                                columns={this.getItemCols()}
                            />
                        </Panel.Body>
                    </Panel>
                </div>
            </div>
        )
    }
}