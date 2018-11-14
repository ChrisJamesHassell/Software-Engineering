import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Glyphicon, Panel } from 'react-bootstrap';
import NavIcons from '../../../images/icons/NavIcons';
import { categories, path } from '../../fetchHelpers';
import { setUserData } from '../../actions/actions';
import fetch from 'cross-fetch';

const DashBoxBody = (props) => (
    <div className='dash-body'>BODEH
    </div>
)

const DashBoxHeader = (props) => {
    return (
        <div className='dash-header' style={{ display: 'inline-flex' }}>
            <div className='dash-header icon'><NavIcons icon={props.category} fill={'#149c82'} /></div>
            <div className='dash-header category'>{props.category}</div>
            <div className='dash-header options'><Glyphicon glyph="cog" /></div>
        </div>
    )
}

class DashBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            style: {
                minWidth: '300px',
                flex: '1',
                margin: '20px'
            }
        }
    }

    componentDidMount() {
        let fetchHeader = {
            "filter": {
                "category": this.props.category,
                "pinned": true,
                "weeksAhead": 2
            },
            "group": {
                "groupId": this.props.user.selfGroupId
            },
            "user": {
                "userId": this.props.user.userId
            }
        }
    }

    render() {
        return (
            <Panel style={this.state.style}>
                <Panel.Heading><DashBoxHeader {...this.props} /></Panel.Heading>
                <Panel.Body><DashBoxBody {...this.props} /></Panel.Body>
            </Panel>
        )
    }
}
// const DashBox = (props) => {
//     let style = {
//         minWidth: '300px',
//         flex: '1',
//         margin: '20px'
//     }

//     let fetchHeader = {
//         "filter": {
//             "category": props.category,
//             "pinned": true,
//             "weeksAhead": 2
//         },
//         "group": {
//             "groupId": this.props.user.selfGroupId
//         },
//         "user": {
//             "userId": this.props.user.userId
//         }
//     }

//     return (
//         <Panel style={style}>
//             <Panel.Heading><DashBoxHeader {...props} /></Panel.Heading>
//             <Panel.Body><DashBoxBody {...props} /></Panel.Body>
//         </Panel>
//     )
// }

DashBox.propTypes = {
    icon: PropTypes.any,
    category: PropTypes.string.isRequired,
    header: PropTypes.any,
    body: PropTypes.any,
    footer: PropTypes.any
}

class Dash extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() {
        let userId = parseInt(localStorage.getItem('userId'));
        let selfGroupId = parseInt(localStorage.getItem('selfGroupId'));
        let groupList = JSON.parse(localStorage.getItem('groupList'));

        let userData = {
            username: localStorage.getItem('username').toString(),
            userId: userId,
            selfGroupId: selfGroupId,
            groupList: groupList
        }

        this.props.dispatch(setUserData(userData)) // set the user data in the store
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
                        <DashBox key={index} category={category} {...this.props[category]} user={this.props.User} {...this.state} />
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