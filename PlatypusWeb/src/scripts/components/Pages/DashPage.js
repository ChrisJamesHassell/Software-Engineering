import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Glyphicon, Panel } from 'react-bootstrap';
import NavIcons from '../../../images/icons/NavIcons';
import { categories, path } from '../../fetchHelpers';
import { setUserData } from '../../actions/actions';
import fetch from 'cross-fetch';

class DashBoxBody extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            task: [],
            event: [],
            doc: []
        }
    }

    componentDidMount() {
        let fetchHeader = {
            "filter": {
                "category": this.props.category.toUpperCase(),
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

        console.log("BODEH FETCH HEADER: ", fetchHeader);

        var opts = {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'filter': JSON.stringify(fetchHeader.filter),
                'group': JSON.stringify(fetchHeader.group),
                'user': JSON.stringify(fetchHeader.user)
            }
        };
        fetch(`${path}/app/${this.props.itemType}`, opts)
            .then(res => res.json())
            .then(
                (result) => {
                    console.log("RESPONSE RESULT: for " + this.props.itemType + "category: " + this.props.category + ": ", result);
                    this.setState({
                        isLoaded: true,
                    });
                    this.setState(state => {
                        state[this.props.itemType] = [result.data[this.props.itemType]]
                    })
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    console.log("THERE WAS AN ERROR FETCHING: ", this.props.itemType);
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            )
    }

    render() {
        return (
            <div className='dash-body'>{this.props.itemType}</div>
        )
    }
}
// const DashBoxBody = (props) => (
// <div className='dash-body'>BODEH
// </div>
// )

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
            },
            items: [],
        }
    }

    componentDidMount() {
        // let fetchHeader = {
        //     "filter": {
        //         "category": this.props.category.toUpperCase(),
        //         "pinned": true,
        //         "weeksAhead": 2
        //     },
        //     "group": {
        //         "groupId": this.props.user.selfGroupId
        //     },
        //     "user": {
        //         "userId": this.props.user.userId
        //     }
        // }

        // const paths = ['task', 'event', 'doc'];

        // paths.map(url => {
        //     var opts = {
        //         method: 'GET',
        //         credentials: 'include',
        //         headers: {
        //             'Content-Type': 'application/json',
        //             'filter': JSON.stringify(fetchHeader.filter),
        //             'group': JSON.stringify(fetchHeader.group),
        //             'user': JSON.stringify(fetchHeader.user)
        //         }
        //     };
        //     fetch(`${path}/app/${url}`, opts)
        //         .then(res => res.json())
        //         .then(
        //             (result) => {
        //                 console.log("RESPONSE RESULT: for " + url + "category: " + this.props.category + ": ", result);
        //                 this.setState({
        //                     isLoaded: true,
        //                     items: result.items
        //                 });
        //             },
        //             // Note: it's important to handle errors here
        //             // instead of a catch() block so that we don't swallow
        //             // exceptions from actual bugs in components.
        //             (error) => {
        //                 console.log("THERE WAS AN ERROR FETCHING: ", url);
        //                 this.setState({
        //                     isLoaded: true,
        //                     error
        //                 });
        //             }
        //         )
        // })
    }

    render() {
        return (
            <Panel style={this.state.style}>
                <Panel.Heading><DashBoxHeader {...this.props} /></Panel.Heading>
                {['task', 'event', 'doc'].map(itemType => {
                    return <Panel.Body key={this.props.category + itemType}><DashBoxBody key={this.props.category + itemType} {...this.props} itemType={itemType} /></Panel.Body>
                })}
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
                        <DashBox key={index} category={category} {...this.props[category]} user={this.state.user} />
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