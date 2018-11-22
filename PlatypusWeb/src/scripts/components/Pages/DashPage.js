import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Glyphicon, Panel, Label } from 'react-bootstrap';
import qs from 'qs';
import fetch from 'cross-fetch';
import ReactTable from 'react-table';
import 'react-table/react-table.css'
import NavIcons from '../../../images/icons/NavIcons';
import CustomCheckbox from '../Forms/CustomCheckbox';
import { categories, path } from '../../fetchHelpers';


const CustomTableCell = (props) => (
    <div className="table-cell-body" style={props.style}>{props.value}</div>
)

// ================================================================== //
//  DASHBODY
// ================================================================== //
class DashBoxBody extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            items: [],
            inputStyle: {},
            cellStyle: {
                true: {
                    cell: {
                        textDecoration: 'line-through', color: '#b4bfbd'
                    },
                    label: {
                        color: '#c8d2d0', textDecoration: 'line-through'
                    },
                    checkBox: {
                        background: '#18bc9c',
                        fontSize: '15px',

                    }
                },
                false: {
                    cell: {
                        textDecoration: 'none', color: '#788084'
                    },
                    label: {
                        color: 'white', textDecoration: 'none'
                    },
                    checkBox: {
                        background: '#eee',
                        fontSize: 0
                    }
                }
            },
            selection: [],
            highestPriority: { key: 1, value: 1, color: '#3498db' }
        }
        this.toggleSelection = this.toggleSelection.bind(this);
        this.getPriorityStyle = this.getPriorityStyle.bind(this);
        // this.setHighestPriority = this.setHighestPriority.bind(this);
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
        this.setState({ items });
    }

    onUpdate = async (values, checked) => {
        console.log({ values });
        const response = await fetch(`${path}/app/task/update`, {
            body: JSON.stringify({
                task: {
                    ...values,
                    completed: checked ? 1 : 0,
                    taskID: values.itemID,
                    pinned: values.pinned ? 1 : 0
                },
            }),
            credentials: 'include',
            method: 'POST',
        });

        if (!response.ok) {
            throw Error('Error status code');
        }
    }

    toggleSelection(isOn, key, values) {
        let selection = [...this.state.selection];
        const keyIndex = selection.indexOf(key);

        if (keyIndex >= 0) { // check to see if the key exists
            // it does exist so we will remove it using destructing
            selection = [
                ...selection.slice(0, keyIndex),
                ...selection.slice(keyIndex + 1)
            ];
        } else {
            selection.push(key); // it does not exist so add it
        }
        this.onUpdate(isOn, values);
        this.setState({ selection }); // update the state
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
                    accessor: 'completed',
                    Cell: props => <CustomCheckbox
                        key={props.name}
                        {...props}
                        toggleSelection={this.toggleSelection}
                        style={this.state.cellStyle[props.original.completed].checkBox}
                    />
                },
                {
                    Header: 'Name',
                    accessor: 'name',
                    Cell: props => <CustomTableCell
                        key={props.name}
                        value={props.value}
                        {...props}
                        style={this.state.cellStyle[props.original.completed].cell}
                    />
                },
                {
                    Header: 'Priority',
                    accessor: 'priority',
                    Cell: props => <Label
                        key={props.name}
                        bsStyle={this.getPriorityStyle(props.value, props.index, props.original.completed).class}
                        style={this.state.cellStyle[props.original.completed].label}
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

    // setHighestPriority(value, key, isRemoved=false) {
    //     const current = { key: key, value: this.getPriorityStyle(value).key, color: this.getPriorityStyle(value).color };
    //     const highest = this.state.highestPriority;
    //     if (current.value > highest.value) {
    //         this.setState({ highestPriority: current })
    //     }
    //}

    getPriorityStyle(key, index, completed=false) {
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
        var data = [];
        this.state.items.forEach(item => {
            data.push(item[this.props.itemType])
        })
        return (
            <div className='dash-body'>
                <div className='dash-body-type'>{this.props.itemType}</div>
                {this.state.items.length > 0 ?
                    <ReactTable
                        defaultPageSize={3}
                        data={data}
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