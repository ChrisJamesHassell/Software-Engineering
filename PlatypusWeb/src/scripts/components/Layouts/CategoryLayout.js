import React from 'react';
import {DashBox} from '../Pages/DashPage';

export default class CategoryLayout extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <DashBox category={this.props.category} />
        )
    }
}