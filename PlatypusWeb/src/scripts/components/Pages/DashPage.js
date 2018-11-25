import React from 'react';
import { connect } from 'react-redux';
// import PropTypes from 'prop-types';
import { Glyphicon, Panel, Label, Checkbox, Button } from 'react-bootstrap';
import qs from 'qs';
import fetch from 'cross-fetch';
import ReactTable from 'react-table';
import 'react-table/react-table.css'
import NavIcons from '../../../images/icons/NavIcons';
import { categories, path, categoryColor, itemTypes, getPriorityStyle, filterProps } from '../../fetchHelpers';
import moment from 'moment';
import EventForm from '../Forms/EventForm';

// ================================================================== //
//  DASHBODY
// ================================================================== //
class DashBoxBody extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            selected: -1,
            items: [],
            rowIndex: 0,
            method: '',
            itemTypeBg: '#b4bfbd',
            overdue: [],
            error: '',
            modal: '',
            show: false,
        }
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

    // === FILTERRESPONSEITEMS === //
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
                description: values.description,
                pinned: values.pinned ? 1 : 0,
                // [itemType + 'ID']: values[itemType + 'ID'] || values.itemID,
            }
        }
        switch (itemType) {
            case "task":
                item[itemType].completed = values.completed ? 1 : 0;
                item[itemType].deadline = this.getFormattedDate(values.deadline);
                item[itemType].priority = values.priority;
                item[itemType].notification = this.getFormattedDate(values.notification);
                item[itemType][itemType + 'ID'] = values[itemType + 'ID'] || values.itemID;
                break;

            case "event":
                item[itemType].startDate = values.start;
                item[itemType].endDate = values.end;
                item[itemType].location = values.location;
                item[itemType].notification = this.getFormattedDate(values.notification);
                item[itemType][itemType + 'ID'] = values[itemType + 'ID'] || values.itemID;
                break;

            case "document":
                let imgUrl = `${path}/app/doc/download?docID=`;
                item[itemType].expirationDate = this.getFormattedDate(values.expiration);
                item[itemType].documentID = values.documentID || values.itemID;
                item[itemType].fileName = values.fileName;
                item[itemType].imgUrl = imgUrl + (values.documentID || values.itemID);
                break;

            default:
        }
        return item;
    }

    // === GETITEMTYPECOLS === //
    getItemTypeCols(key) {
        // Universial columns for all itemTypes
        const colsMap = {
            "task": [
                {
                    Header: 'Completed',
                    id: 'completed',
                    className: 'dash-body-completed',
                    accessor: d => d.completed, //d[this.props.itemType].completed,
                    Cell: row =>
                        (
                            <Checkbox
                                className="cb"
                                style={{ background: row.value ? '#18bc9c' : '#eee' }}
                                checked={row.value}
                                onChange={e => this.handleCheck(e.target, row.original, row.index)}>
                                <Glyphicon
                                    className="cb-check"
                                    glyph="ok"
                                    style={{ color: 'white', fontSize: row.value ? '15px' : '0', transition: 'font-size .5s' }}
                                />
                            </Checkbox>
                        )
                },
                {
                    Header: 'Name',
                    id: 'name',
                    className: 'dash-body-cell',
                    accessor: d => d.name,
                    getProps: (state, rowInfo) => ({
                        style: {
                            color: (rowInfo && rowInfo.row.completed ? '#c8d2d0' : '#788084'),
                            textDecoration: (rowInfo && rowInfo.row.completed ? 'line-through' : 'none'),
                            content: rowInfo && rowInfo
                        }
                    }),
                    Cell: props => {
                        return (
                            <div>
                                {props.value}
                            </div>
                        )
                    }
                },
                {
                    Header: 'Deadline',
                    id: 'deadline',
                    className: 'dash-body-cell',
                    accessor: d => d.deadline,
                    getProps: (state, rowInfo) => ({
                        style: {
                            color: (rowInfo && rowInfo.row.completed ? '#c8d2d0' : '#788084'),
                            textDecoration: (rowInfo && rowInfo.row.completed ? 'line-through' : 'none'),
                            content: rowInfo && rowInfo
                        }
                    }),
                    Cell: props => {
                        const overdue = Math.floor((moment.duration(moment().diff(props.value))).asDays());
                        const multiple = overdue > 1 ? 's' : '';
                        return <div>{props.value && moment(props.value).format('MMM DD, YYYY')}
                            {overdue > 0 && <div style={{ color: props.original.completed ? '#c8d2d0' : '#e74c3c', fontSize: '.8em' }}>{overdue} day{multiple} overdue</div>}
                        </div>
                    }
                },
                {
                    Header: 'Priority',
                    id: 'priority',
                    className: 'dash-body-priority',
                    accessor: d => d.priority, // d[this.props.itemType].priority,
                    Cell: props => <Label className="dash-body-priority"
                        bsStyle={getPriorityStyle(props.value, props.index, props.original.completed, props).class}
                        style={{ textDecoration: props.original.completed ? 'line-through' : 'none' }}
                    >
                        {getPriorityStyle(props.value).value}
                    </Label>,
                    sortMethod: (a, b) => {
                        if (a.length === b.length) {
                            return a > b ? 1 : -1;
                        }
                        return a.length > b.length ? 1 : -1;
                    }
                },
            ],
            "event": [
                {
                    Header: 'Name',
                    id: 'name',
                    accessor: d => d.name,
                },
                {
                    Header: 'Start Date',
                    id: 'startDate',
                    accessor: d => d.startDate,
                    Cell: props => {
                        return (
                            <div>
                                <EventForm
                                    visible={this.state.show}
                                    modal={'Edit'}
                                    handleClose={this.handleClose}
                                    data={props}
                                    // formData={this.state.data.data}
                                    events={[]}
                                    deleteEvent={this.deleteEvent}
                                    handleSubmission={this.handleSubmission}
                                />
                                {moment(props.value).format('MMM DD, YYYY')}
                            </div>)
                    }
                },
                {
                    Header: 'End Date',
                    id: 'endDate',
                    accessor: d => d.endDate,
                    Cell: props => {
                        const overdue = Math.floor((moment.duration(moment().diff(props.value))).asDays());
                        const multiple = overdue > 1 ? 's' : '';
                        return <div>{props.value && moment(props.value).format('MMM DD, YYYY')}
                            {overdue > 0 && <div style={{ color: props.original.completed ? '#c8d2d0' : '#e74c3c', fontSize: '.8em' }}>{overdue} day{multiple} overdue</div>}
                        </div>
                    }
                }
            ],
            "doc": [
                {
                    Header: 'Name',
                    id: 'name',
                    accessor: d => d.name,
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
                    id: 'imgUrl',
                    accessor: d => d.imgUrl,
                    Cell: props => {
                        const style = {
                            background: categoryColor[props.original.category.toUpperCase()],
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
                }
            ]
        }
        return colsMap[key];
    }

    // === HANDLECHECK === //
    handleCheck = (e, values, rowIndex) => { // Assume only tasks will be checked
        this.setState({ rowIndex: rowIndex });
        const newVal = Object.assign({}, { ...values }, { completed: e.checked ? 1 : 0 })
        this.handleOverdueState(newVal, filterProps[this.props.itemType]); // Now update all the "overdue" items      
        this.onUpdate(newVal, rowIndex);
    }

    // === HANDLECLOSE === //
    handleClose = () => {
        this.setState({ show: false })
    }

    // === HANDLEJSONRESPONSE === //
    handleJsonResponse(response, isEdit = false) {
        let itemType = this.props.itemType !== 'doc' ? this.props.itemType : 'document';
        let { data: item } = response;
        let items = Object.assign([], this.state.items);

        if (this.state.method === 'GET') {
            this.setState({ method: '' });
            if (item.length > 0) { // make sure -something- was returned, so we don't do work unless needed
                item.forEach(i => {
                    items.push(this.getFormattedItem(i[itemType])[itemType]);
                    items = this.filterResponseItems(items);
                })
            }
            else items = [];
        }

        else { // Otherwise it's an EDIT or a DELETE
            this.setState({ method: '' });
            const formattedItem = this.getFormattedItem(item)[itemType];
            if (isEdit) {
                // if (response.message.includes('delete')) events = this.handleEdit(this.state.currentId, true);
                // else events = this.handleEdit(formattedItem);
                items[this.state.rowIndex] = formattedItem;
            }
            else items = [...this.state.items, formattedItem]; // Adding an event
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

    // === ONDELETE === //
    onDelete = (props) => {
        this.setState({ currentId: props.event[this.props.itemType + 'ID'], method: 'POST' });
        const url = `${path}/app/${this.props.itemType}/delete`;
        this.fetchRequest(url, 'POST', props, true);
        this.handleClose();
    }

    // === ONUPDATE === //
    onUpdate = async (values, rowIndex = 0) => { // url, method, body, isEdit?
        const url = `${path}/app/${this.props.itemType}/update`;
        const newBody = Object.assign({}, { ...this.state.items[rowIndex] }, values);

        const body = this.getFormattedItem(newBody);
        this.setState({ method: 'POST' });
        this.fetchRequest(url, 'POST', body, true);
    }
    // isSelected = key => {
    //     return this.state.selection.includes(key);
    // };

    // === VALIDATERESPONSE === //
    validateResponse = (result) => {
        this.setState({ isLoaded: true });
        if (!result.ok) throw Error(result.statusText);
        return result;
    }

    render() {
        return (
            <div className='dash-body'>
                <div className='dash-body-type' style={{ color: this.state.itemTypeBg, display: 'inline-flex', width: '100%' }}>
                    <div style={{ flex: '1' }}>
                        <NavIcons icon={this.props.itemType + 's'} fill={this.state.itemTypeBg} />
                        {this.props.itemType + 's'}
                    </div>
                    <div className='dash-body-buttons'>
                        {/* <Button style={{ background: 'transparent', border: '0' }}>
                            <span className='dash-type-add' color=''>
                                <Glyphicon glyph="plus-sign" style={{ marginRight: '5px' }} /> <b>ADD</b>
                            </span>
                        </Button> */}
                        {/* <Button bsStyle="default" style={{ borderRadius: '0px', marginTop: '10px'}}><Glyphicon style={{ fontSize: '1.1em', paddingRight: '5px', paddingTop: '2px' }} glyph="plus-sign" /><b>ADD {this.props.itemType.toUpperCase()}</b></Button> */}

                    </div>
                </div>
                {this.state.items.length > 0 ?
                    <ReactTable
                        // className="-highlight"
                        defaultPageSize={3}
                        data={this.state.items}
                        resolveData={data => data.map(row => row)}
                        columns={this.getItemTypeCols(this.props.itemType)}
                    />
                    :
                    <div className='dash-body-complete'>
                        <Glyphicon className='dash-body-complete-glyph' glyph="ok-circle" />
                        <div className='dash-body-complete-text'>You're all good</div>
                    </div>}
                {/* <div>
                    <Button bsStyle="default" style={{ borderRadius: '0px', width: '100%', marginTop: '10px'}}><Glyphicon style={{ fontSize: '1.1em', paddingRight: '5px', paddingTop: '2px' }} glyph="plus-sign" /><b>ADD {this.props.itemType.toUpperCase()}</b></Button>
                </div> */}
            </div>
        )
    }
}

// ================================================================== //
//  DASHBOXHEADER
// ================================================================== //
export const DashBoxHeader = (props) => {
    return (
        <div className='dash-header' style={{ display: 'inline-flex' }}>
            <div className='dash-header icon' style={{ position: 'relative' }}>
                <NavIcons
                    icon={props.category}
                    width={40}
                    height={40}
                    spanStyle={{ background: categoryColor[props.category.toUpperCase()], borderRadius: '50%', position: 'absolute', paddingBottom: '11px', paddingRight: '17px' }} />
            </div>
            <div className='dash-header category' style={{ color: 'white' }}>{props.category}</div>
            <div className='dash-header options'>
                {/* <Glyphicon glyph="cog" style={{ color: '#8c9198', fontSize: '1.5em' }} /> */}
                {props.options && <props.options />}
            </div>
        </div>
    )
}

// ================================================================== //
//  DASHBOX
// ================================================================== //
export const DashBox = (props) => {
    return (
        <Panel className='dash-panel'>
            <Panel.Heading style={{ background: categoryColor[props.category.toUpperCase()] }}>
                <DashBoxHeader {...props} />
            </Panel.Heading>
            {(props.itemTypes || itemTypes).map(itemType => {
                return <Panel.Body key={props.category + itemType}>
                    <DashBoxBody key={props.category + itemType} {...props} itemType={itemType} />
                </Panel.Body>
            })}
        </Panel>
    )
}

// ================================================================== //
//  DASH
// ================================================================== //
export default class Dash extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        const appCategories = categories;

        return (
            <div id='page-container'>
                {appCategories.map((category, index) => {
                    return (
                        <DashBox
                            key={index}
                            itemTypes={this.props.itemTypes || itemTypes}
                            category={category} {...this.props[category]}
                        />
                    )
                })}
            </div>
        )
    }
}