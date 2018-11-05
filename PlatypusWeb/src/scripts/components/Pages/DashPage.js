import React from 'react';
import PropTypes from 'prop-types';
import { Glyphicon } from 'react-bootstrap';

const DashContainer = () => (
    <div id='dash-container'>
    </div>
)
/*
            type: 'Tasks',
            id: 0,
            name: 'task01',
            pinned: true,
            description: 'description for task 1',
            category: 'Medical',
            data: {}
*/
const DashBox = ({ icon, title, header, body, footer }) => (
    <div className='dash-box' style={{display: 'flex', flexDirection: 'column'}}>
        <div className='dash-title' style={{ display: 'inline-flex' }}>
            <div className='dash-title icon'>{icon}</div>
            <div className='dash-title title'>{title}</div>
            <div className='dash-title options'><Glyphicon glyph="star" /></div>
        </div>
        <div className='dash-header'>{header}</div>
        <div className='dash-body'>{body}</div>
        <div className='dash-footer'>{footer}</div>
    </div>
)

DashBox.propTypes = {
    icon: PropTypes.any.isRequired,
    title: PropTypes.string.isRequired,
    header: PropTypes.any,
    body: PropTypes.any.isRequired,
    footer: PropTypes.any.isRequired
}

const DashBoxList = ({categories}) => (
    <div className='dash-category'>
        {categories.map((item) => (
            <DashBox key={item.id} {...item} />
        ))}
    </div>
)