import React from 'react';
import { connect } from 'react-redux';
// import PropTypes from 'prop-types';
import { Glyphicon, Panel, Label, Checkbox } from 'react-bootstrap';
import qs from 'qs';
import fetch from 'cross-fetch';
import ReactTable from 'react-table';
import 'react-table/react-table.css'
import NavIcons from '../../../images/icons/NavIcons';
import { categories, path } from '../../fetchHelpers';

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
        }
    }

    async componentDidMount() {
        const response = await fetch(`${path}/app/${this.props.itemType}?${qs.stringify({
            category: this.props.category.toUpperCase(),
            groupID: localStorage.getItem('selfGroupId'),
            pinned: 'null',
            userID: localStorage.getItem('userId'),
            weeksAhead: -1,
        })}`, {
                method: 'GET',
                credentials: 'include',
            });

        const { data: items } = await response.json();
        let formattedItems = [];
        items.forEach(item => {
            formattedItems.push(this.getFetchBody(item[this.props.itemType]))
        })
        this.setState({ items: formattedItems });
    }

    getFetchBody(values) {
        switch (this.props.itemType) {
            case "task":
                return {
                    task: {
                        ...values,
                        completed: values.completed ? 1 : 0,
                        taskID: values.itemID,
                        pinned: values.pinned ? 1 : 0
                    }
                }
            case "event":
                return {
                    event: {

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

    validateResponse = (result) => {
        if (!result.ok) throw Error(result.statusText);
        return result;
    }

    handleJsonResponse(response, rowIndex = 0) {
        const newData = this.getFetchBody(response.data);
        let newItems = Object.assign([], this.state.items);
        newItems[rowIndex] = newData;
        this.setState({ items: newItems });
    }

    onUpdate = async (values, rowIndex = 0) => {
        const response = await fetch(`${path}/app/${this.props.itemType}/update`, {
            body: JSON.stringify(this.getFetchBody(values)),
            credentials: 'include',
            method: 'POST',
        })
            .then(response => this.validateResponse(response))
            .then(validResponse => validResponse.json())
            .then(jsonResponse => this.handleJsonResponse(jsonResponse, rowIndex))
    }

    handleCheck = (e, values, rowIndex) => {
        let value = values.task;
        const newVal = Object.assign({}, { ...value }, { completed: e.target.checked ? 1 : 0 })
        this.onUpdate(newVal, rowIndex);
    }

    isSelected = key => {
        return this.state.selection.includes(key);
    };

    getItemTypeCols(key) {
        // Universial columns for all itemTypes
        const colsMap = {
            "task": [
                {
                    Header: 'Completed',
                    id: 'completed',
                    className: 'dash-body-completed',
                    accessor: d => d[this.props.itemType].completed,
                    Cell: row =>
                        (
                            <Checkbox
                                className="cb"
                                style={{ background: row.value ? '#18bc9c' : '#eee' }}
                                checked={row.value}
                                onChange={e => this.handleCheck(e, row.original, row.index)}>
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
                    accessor: d => d[this.props.itemType].name,
                    getProps: (state, rowInfo) => ({
                        style: {
                            color: (rowInfo && rowInfo.row.completed ? '#c8d2d0' : '#788084'),
                            textDecoration: (rowInfo && rowInfo.row.completed ? 'line-through' : 'none'),
                            content: rowInfo && rowInfo
                        }
                    }),
                },
                {
                    Header: 'Priority',
                    id: 'priority',
                    className: 'dash-body-priority',
                    accessor: d => d[this.props.itemType].priority,
                    Cell: props => <Label className="dash-body-priority"
                        bsStyle={this.getPriorityStyle(props.value, props.index, props.original[this.props.itemType].completed).class}
                        style={{ textDecoration: props.original[this.props.itemType].completed ? 'line-through' : 'none' }}
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
            "event": [],
            "doc": []
        }
        return colsMap[key];
    }

    getPriorityStyle(key, index, completed = false) {
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
                <div className='dash-body-type'>{this.props.itemType}</div>
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
                    spanStyle={{ background: '#b4bfbd', borderRadius: '50%', position: 'absolute', paddingBottom: '11px', paddingRight: '17px' }} />
            </div>
            <div className='dash-header category'>{props.category}</div>
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
                minWidth: '300px',
                flex: '1',
                margin: '20px'
            },
            items: [],
        }
    }

    render() {
        return (
            <Panel style={this.state.style}>
                <Panel.Heading>
                    <DashBoxHeader {...this.props} />
                </Panel.Heading>
                {//['task', 'event', 'doc']
                    ['task', 'event', 'doc'].map(itemType => {
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