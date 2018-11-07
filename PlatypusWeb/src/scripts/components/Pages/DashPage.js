import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Glyphicon, Panel } from 'react-bootstrap';
import NavIcons from '../../../images/icons/NavIcons';
import { categories } from '../../fetchHelpers';

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

const DashBox = (props) => {
    let style = {
        minWidth: '300px',
        flex: '1',
        margin: '20px'
    }
    return (
        <Panel style={style}>
            <Panel.Heading><DashBoxHeader {...props} /></Panel.Heading>
            <Panel.Body><DashBoxBody {...props} /></Panel.Body>
        </Panel>
    )
}

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
    render() {
        const appCategories = Object.keys(this.props)
            .filter(key => categories.includes(key))
            .reduce((obj, key) => {
                obj[key] = this.props[key];
                return obj;
            }, {});

        return (
            <div id='dash-container' style={{ height: '100%', display: 'flex', flexWrap: 'wrap', alignItems: 'stretch', justifyContent: 'space-around'}}>
                {Object.keys(appCategories).map((category, index) => {
                    return (
                        <DashBox key={index} category={category}{...this.props[category]} />
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
    }
});


export default connect(mapStateToProps)(Dash);