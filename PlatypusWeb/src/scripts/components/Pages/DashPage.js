import React from 'react';
import { connect } from 'react-redux';
// import PropTypes from 'prop-types';
import { Glyphicon, Panel, Label, Checkbox } from 'react-bootstrap';
import qs from 'qs';
import fetch from 'cross-fetch';
import ReactTable from 'react-table';
import 'react-table/react-table.css'
import NavIcons from '../../../images/icons/NavIcons';
import { categories, path, categoryColor } from '../../fetchHelpers';
import moment from 'moment';

const filterProps = {
    task: 'deadline',
    event: 'endDate',
    // TODO: ADD DOCS
}

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
        }
    }

    componentDidMount() {
        const url = `${path}/app/${this.props.itemType}?${qs.stringify({
            category: this.props.category.toUpperCase(),
            groupID: localStorage.getItem('selfGroupId'),
            pinned: 'null',
            userID: localStorage.getItem('userId'),
            weeksAhead: 2,
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

    // === VALIDATERESPONSE === //
    validateResponse = (result) => {
        this.setState({ isLoaded: true });
        if (!result.ok) throw Error(result.statusText);
        return result;
    }

    // === GETFORMATTEDITEMS === //
    getFormattedItem(values) {
        switch (this.props.itemType) {
            case "task":
                return {
                    task: {
                        category: values.category,
                        completed: values.completed ? 1 : 0,
                        deadline: moment(values.deadline).format('YYYY-MM-DD'),
                        description: values.description,
                        taskID: values.taskID || values.itemID,
                        name: values.name,
                        notification: moment(values.notification).format('YYYY-MM-DD'),
                        priority: values.priority,
                        pinned: values.pinned ? 1 : 0
                    }
                }
            case "event":
                return {
                    event: {
                        startDate: moment(values.start).format('YYYY-MM-DD'),
                        endDate: moment(values.end).format('YYYY-MM-DD'),
                        location: values.location,
                        eventID: values.eventID || values.itemID,
                        name: values.name,
                        description: values.description,
                        category: values.category,
                        notification: moment(values.notification).format('YYYY-MM-DD'),
                        pinned: values.pinned ? 1 : 0
                    }
                }
            case "doc":
                return {
                    doc: {

                    }
                }
            default:
                return "";
        }
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

    // === HANDLEJSONRESPONSE === //
    handleJsonResponse(response, isEdit = false) {
        let { data: item } = response;
        let items = Object.assign([], this.state.items);

        if (this.state.method === 'GET') {
            this.setState({ method: '' });
            if (item.length > 0) { // make sure -something- was returned, so we don't do work unless needed
                item.forEach(i => {
                    items.push(this.getFormattedItem(i[this.props.itemType])[this.props.itemType]);
                    items = this.filterResponseItems(items);
                })
            }
            else items = [];
        }

        else { // Otherwise it's an EDIT or a DELETE
            this.setState({ method: '' });
            const formattedItem = this.getFormattedItem(item)[this.props.itemType];
            // console.log("FORMATTED ITEM: ", formattedItem)
            if (isEdit) {
                // if (response.message.includes('delete')) events = this.handleEdit(this.state.currentId, true);
                // else events = this.handleEdit(formattedItem);
                items[this.state.rowIndex] = formattedItem;
            }
            else items = [...this.state.items, formattedItem]; // Adding an event
        }

        this.setState({ items });
    }

    // === ONUPDATE === //
    onUpdate = async (values, rowIndex = 0) => { // url, method, body, isEdit?
        const url = `${path}/app/${this.props.itemType}/update`;
        const newBody = Object.assign({}, { ...this.state.items[rowIndex] }, values);
        const body = this.getFormattedItem(newBody);

        this.setState({ method: 'POST' });
        this.fetchRequest(url, 'POST', body, true);
    }

    // === HANDLECHECK === //
    handleCheck = (e, values, rowIndex) => { // Assume only tasks will be checked
        this.setState({ rowIndex: rowIndex });
        const newVal = Object.assign({}, { ...values }, { completed: e.checked ? 1 : 0 })
        this.handleOverdueState(newVal, filterProps[this.props.itemType]); // Now update all the "overdue" items      
        this.onUpdate(newVal, rowIndex);
    }

    // isSelected = key => {
    //     return this.state.selection.includes(key);
    // };

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
                        return <div>{moment(props.value).format('MMM DD, YYYY')}
                            {overdue > 0 && <div style={{ color: props.original.completed ? '#c8d2d0' : '#e74c3c', fontSize: '.8em' }}>{overdue} day overdue</div>}
                        </div>
                    }
                },
                {
                    Header: 'Priority',
                    id: 'priority',
                    className: 'dash-body-priority',
                    accessor: d => d.priority, // d[this.props.itemType].priority,
                    Cell: props => <Label className="dash-body-priority"
                        bsStyle={this.getPriorityStyle(props.value, props.index, props.original.completed, props).class}
                        style={{ textDecoration: props.original.completed ? 'line-through' : 'none' }}
                    >
                        {this.getPriorityStyle(props.value).value}
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
                    Cell: props => <div>{moment(props.value).format('MMM DD, YYYY')}</div>
                },
                {
                    Header: 'End Date',
                    id: 'endDate',
                    accessor: d => d.endDate,
                    Cell: props => {
                        const overdue = Math.floor((moment.duration(moment().diff(props.value))).asDays());
                        return <div>{moment(props.value).format('MMM DD, YYYY')}
                            {overdue > 0 && <div style={{ color: props.original.completed ? '#c8d2d0' : '#e74c3c', fontSize: '.8em' }}>{overdue} day overdue</div>}
                        </div>
                    }
                }
            ],
            "doc": []
        }
        return colsMap[key];
    }

    // === GETPRIORITYSTYLE === //
    getPriorityStyle(key, index, completed = false, props) {
        let classStyle = null;
        if (completed) classStyle = "default";
        let priorityMap = {
            "LOW": { class: classStyle || "info", value: "LOW", key: 1, color: '#3498db' },
            "MID": { class: classStyle || "warning", value: "MEDIUM", key: 2, color: '#f39c12' },
            "HIGH": { class: classStyle || "danger", value: "HIGH", key: 3, color: '#e74c3c' }
        }
        return priorityMap[key];
    }

    render() {
        return (
            <div className='dash-body'>
                <div className='dash-body-type' style={{ color: this.state.itemTypeBg }}>
                    <NavIcons icon={this.props.itemType + 's'} fill={this.state.itemTypeBg}/>
                    {this.props.itemType + 's'}
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
            </div>
        )
    }
}

// ================================================================== //
//  DASHBOXHEADER
// ================================================================== //
const DashBoxHeader = (props) => {
    return (
        <div className='dash-header' style={{ display: 'inline-flex' }}>
            <div className='dash-header icon' style={{ position: 'relative' }}>
                <NavIcons
                    icon={props.category}
                    width={40}
                    height={40}
                    spanStyle={{ background: categoryColor[props.category.toUpperCase()], borderRadius: '50%', position: 'absolute', paddingBottom: '11px', paddingRight: '17px' }} />
            </div>
            <div className='dash-header category' style={{color: 'white'}}>{props.category}</div>
            <div className='dash-header options'>{/* <Glyphicon glyph="cog" style={{ color: '#8c9198', fontSize: '1.5em' }} /> */}</div>
        </div>
    )
}

// ================================================================== //
//  DASHBOX
// ================================================================== //
class DashBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            style: {
                minWidth: '400px',
                flex: '1',
                margin: '20px',
                // background: categoryColor[this.props.category.toUpperCase()]
            },
            items: [],
        }
    }

    render() {
        return (
            <Panel style={this.state.style}>
                <Panel.Heading style={{background: categoryColor[this.props.category.toUpperCase()]}}>
                    <DashBoxHeader {...this.props} />
                </Panel.Heading>
                {//['task', 'event', 'doc']
                    ['task', 'event'].map(itemType => {
                        return <Panel.Body key={this.props.category + itemType}>
                            <DashBoxBody key={this.props.category + itemType} {...this.props} itemType={itemType} />
                        </Panel.Body>
                    })}
            </Panel>
        )
    }
}

// ================================================================== //
//  DASH
// ================================================================== //
class Dash extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {
                username: localStorage.getItem('username').toString(),
                userId: parseInt(localStorage.getItem('userId')),
                selfGroupId: parseInt(localStorage.getItem('selfGroupId')),
                groupList: JSON.parse(localStorage.getItem('groupList'))
            }
        }
    }

    componentDidMount() {
        // this.props.dispatch(setUserData(this.state.user)) // set the user data in the store
    }

    render() {
        const appCategories = Object.keys(this.props)
            .filter(key => categories.includes(key))
            .reduce((obj, key) => {
                obj[key] = this.props[key];
                return obj;
            }, {});

        return (
            <div id='page-container'>
                {Object.keys(appCategories).map((category, index) => {
                    return (
                        <DashBox key={index} category={category} {...this.props[category]} user={this.state.user} {...this.props} />
                    )
                })}
            </div>
        )
    }
}

const mapStateToProps = state => ({
    Appliances: {
        events: state.events.Appliances,
        documents: state.documents.Appliances,
        tasks: state.tasks.Appliances,
    },
    Auto: {
        events: state.events.Auto,
        documents: state.documents.Auto,
        tasks: state.tasks.Auto,
    },
    Meals: {
        events: state.events.Meals,
        documents: state.documents.Meals,
        tasks: state.tasks.Meals,
    },
    Medical: {
        events: state.events.Medical,
        documents: state.documents.Medical,
        tasks: state.tasks.Medical,
    },
    Miscellaneous: {
        events: state.events.Miscellaneous,
        documents: state.documents.Miscellaneous,
        tasks: state.tasks.Miscellaneous,
    },
    User: {
        username: state.user.username,
        userId: state.user.userId,
        selfGroupId: state.user.selfGroupId,
        groupList: state.user.groupList
    }
});

export default connect(mapStateToProps)(Dash);