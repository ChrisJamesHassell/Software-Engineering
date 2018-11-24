import React from 'react';
import moment from 'moment';
import qs from 'qs';
import { Modal, FormGroup, Col, Checkbox, Glyphicon, Button, Form, FormControl, ControlLabel, HelpBlock } from 'react-bootstrap';
import Dash from '../Pages/DashPage';
import { path, categories, filterProps, categoryOptions, catMap } from '../../fetchHelpers';

/* <Form horizontal action={actionUrl} method={method} encType={encType} style={{ width: '100%', padding: '2em' }} >
    <input type="hidden" name="userID" value={localStorage.getItem('userId')} />
    <input type="hidden" name="groupID" value={localStorage.getItem('selfGroupId')} />
    <FormGroup controlId="name">
        <Col componentClass={ControlLabel} sm={3}>Name</Col>
        <Col sm={9}>
            <FormControl
                type="text"
                placeholder="Name of the document..."
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
                value={catMap[this.props.category] || this.state.data.category}
                disabled={this.props.category ? 1 : 0}
                onChange={e => this.handleChange(e.target)}
            >
                {(this.props.category && <option value={catMap[this.props.category]}>{this.props.category}</option>) ||
                    categoryOptions.map((category) => {
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

    <FormGroup controlId="expirationDate">
        <Col componentClass={ControlLabel} sm={3}>Expiration Date</Col>
        <Col sm={9}>
            <FormControl
                type="date"
                value={this.state.data.expirationDate}
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


<input type="file" name="FILE" accept="image/*" />
<input type='submit' />
<Button bsStyle="danger">DELETE</Button>
</Form> * /}*/
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
        // console.log("E: ", e);
        this.setState({ data: { ...this.state.data, [e.id]: e.value } });
    }

    handleCheck = (e) => {
        this.setState({ data: { ...this.state.data, pinned: e.checked ? 1 : 0 } });
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
        /*
                        <div>
                    <div>
                        <form action={url} method="post" encType="multipart/form-data">
                            <input type="hidden" name="userID" value={localStorage.getItem('userId')} />
                            <input type="hidden" name="groupID" value={localStorage.getItem('selfGroupId')} />
                            <input type="hidden" name="pinned" value={1} />

                            <input type="text" name="name" value="stupidname" />
                            <input type="hidden" name="category" value="APPLIANCES" />
                            <input type="hidden" name="expirationDate" value={null} />
                            <input type="file" name="FILE" accept="image/*" />
                            <input type="submit" />
                        </form>
                    </div>

                    <div className="image-go-here">
                    </div>
                </div>
        */
        const isCreate = this.props.modal === 'Create';
        const url = `${path}/app/${this.props.itemType}/add`;
        let actionUrl = '';
        let encType = '';
        let method = '';
        if (isCreate) {
            actionUrl = url;
            encType = 'multipart/form-data';
            method = 'post';
        }

        console.log("ACTION URL: ", actionUrl);
        console.log("encType: ", encType);
        console.log("MEDTHOD: ", method);
        console.log("IS CREATE: ", isCreate);
        return (
            <Modal show={this.props.visible} onHide={this.props.handleClose}>
                <div>
                    <form action={url} method="post" encType="multipart/form-data">
                        <input type="hidden" name="userID" value={localStorage.getItem('userId')} />
                        <input type="hidden" name="groupID" value={localStorage.getItem('selfGroupId')} />
                        <input type="hidden" name="pinned" value={1} />

                        <input type="text" name="name" />
                        <select name="category">
                            {(this.props.category && <option value={catMap[this.props.category]}>{this.props.category}</option>) ||
                                categoryOptions.map((category) => {
                                    return <option key={category.label} value={category.value}>{category.label}</option>
                                })}
                        </select>
                        <input type="date" name="expirationDate" />
                        <input type="file" name="FILE" accept="image/*" />
                        <input type="submit" />
                    </form>

                </div>
            </Modal >
        )
    }
}


class DocumentBody extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            method: '',
            items: [],
            overdue: [],
            rowIndex: null,
            itemID: null,
            imgPath: `${path}/app/doc/download?docID=`,
            modal: null,
            show: false,
            data: defaultVals,
        };
    }

    componentDidMount() {
        const url = `${path}/app/${this.props.itemType}?${qs.stringify({
            category: this.props.category.toUpperCase(),
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

    // // === FILTERRESPONSEITEMS === //
    filterResponseItems = (items) => {
        const key = filterProps[this.props.itemType];
        return items.filter(item => {
            const overdue = Math.floor((moment.duration(moment().diff(item[key]))).asDays()) || 0;
            this.handleOverdueState(item, key);
            if (item.pinned || overdue < 1) return item;
        })
    }

    getFormattedDate = (date) => {
        if (date) return moment(date).format('MMM DD, YYYY');
        return null;
    }

    // === GETFORMATTEDITEMS === //
    getFormattedItem(values) {
        let itemType = this.props.itemType !== 'doc' ? this.props.itemType : 'document';
        let item = {
            group: { groupID: localStorage.getItem('selfGroupId') },
            [itemType]: {
                name: values.name,
                category: values.category,
                description: values.description || '',
                pinned: values.pinned ? 1 : 0,
            }
        }
        item[itemType].expirationDate = this.getFormattedDate(values.expirationDate);
        item[itemType].documentID = values.documentID || values.itemID;
        item[itemType].fileName = values.fileName;
        item[itemType].imgPath = this.state.imgPath + (values.documentID || values.itemID);
        return item;
    }

    // === HANDLECLOSE === //
    handleClose = () => {
        this.setState({ show: false })
    }

    // === HANDLEEDIT === //
    handleEdit = (itemType, isDelete = false) => {
        let editedIndex = null;
        let items = this.state.items;

        if (isDelete) { // For DELETION
            editedIndex = itemType;
            items = items.filter(ii => ii.id !== editedIndex);
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
                    items = this.filterResponseItems(items);
                })
            }
            else items = [];
        }

        else { // Otherwise it's an EDIT or a DELETE
            this.setState({ method: '' });
            const formattedItem = this.getFormattedItem(item).document;
            if (isEdit) {
                if (response.message.includes('delete')) items = this.handleEdit(this.state.documentID, true);
                else items = this.handleEdit(formattedItem);
                items[this.state.rowIndex] = formattedItem;
            }
            else items = [...this.state.items, formattedItem]; // ADDing a document
        }

        this.setState({ items });
    }

    // === HANDLEOVERDUESTATE === //
    handleOverdueState = (item, dateKey) => {
        const idKey = this.props.itemType + 'ID'; //eventID, taskID
        const overdue = Math.floor((moment.duration(moment().diff(item[dateKey]))).asDays()) || 0;
        const overdues = this.state.overdue.filter(od => od[idKey] !== item[idKey]);
        let newOverdues = [];
        if (overdue > 0 && item.pinned && !item.completed) newOverdues = [...overdues, item];
        else newOverdues = this.state.overdue.filter(od => od[idKey] !== item[idKey]);

        this.setState({ overdue: newOverdues });
        this.setState({ itemTypeBg: newOverdues.length > 0 ? '#e74c3c' : '#b4bfbd' })
    }

    // === ONCREATE === //
    onCreate = (props) => {
        this.setState({ show: true, modal: 'Create' });
    }

    // === HANDLEDELETE === //
    onDelete = (props) => {
        this.setState({ method: 'POST', itemID: props.documentID || props.itemID });
        const url = `${path}/app/${this.props.itemType}/delete`;
        this.fetchRequest(url, 'POST', props, true);
        this.handleClose();
    }

    // === VALIDATERESPONSE === //
    validateResponse = (result) => {
        this.setState({ isLoaded: true });
        if (!result.ok) throw Error(result.statusText);
        else return result;
    }

    render() {
        return (
            <div>
                <DocumentForm
                    category={this.props.category}
                    visible={this.state.show}
                    modal={this.state.modal}
                    handleClose={this.handleClose}
                    data={this.state.data}
                    items={this.state.items}
                    onDelete={this.onDelete}
                    {...this.props}
                    {...this.state}
                // handleSubmission={this.handleSubmission}
                />
                <div>{this.props.category}</div>
                <div style={{ width: '100%' }}>
                    <div><Button bsStyle="success" onClick={this.onCreate}>ADD</Button></div>
                    {this.state.items.map((item, index) => {
                        console.log("ITEM: ", item);
                        return (
                            <div key={`${item.name}-${index}`} style={{ display: 'inline-flex' }}>
                                <div key={item.name} style={{ flex: '1' }}>{item.name}</div>
                                <div>
                                    <Button
                                        key={item.name + '-delete'}
                                        bsStyle="danger"
                                        onClick={e => this.onDelete({
                                            userID: localStorage.getItem('userId'),
                                            document: {
                                                fileName: item.fileName,
                                                documentID: item.documentID
                                            }
                                        })}>
                                        DELETE
                                    </Button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }
}


export default class Document extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (
            <div>
                {categories.map((category, index) => {
                    return (
                        <DocumentBody
                            key={category + index}
                            category={category}
                            itemType={this.props.itemType}
                        />
                    )
                })}

            </div>
        )
    }
}