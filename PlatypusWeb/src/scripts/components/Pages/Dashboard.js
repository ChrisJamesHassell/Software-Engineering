import React from 'react';
import { Route } from 'react-router-dom';
import { Grid, NavItem, Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import routes from '../../routes';
import NavIcons from '../../../images/icons/NavIcons';

function Dashboard() {
    var mainHeight = (100 - ((60 / (60 + window.screen.availHeight)) * 100)).toString() + "%"
    return (
        <div id='content'>
            <div id='main-grid-row'>
                <div id='left-nav' style={{ minWidth: '210px' }}>
                    <LeftNav />
                </div>
                <Main mainHeight={mainHeight} />
            </div>
        </div>
    );
}

const Main = (props) => {
    return (

        <div id='main-div' style={{ width: '100%', height: props.mainHeight, padding: "20px", margin: "0px", overflowY: "auto" }}>
            {routes.map((route, index) => (
                <Route
                    key={index}
                    path={route.path}
                    exact={route.exact}
                    component={route.main}
                />
            ))}
        </div>
    )
}

class LeftNavInner extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isMouseOver: false,
            fill: 'white'
        }
        this.handleMouse = this.handleMouse.bind(this);
    }

    handleMouse(isOver) {
        const fill = isOver ? '#18bc9c' : 'white';
        this.setState({ isMouseOver: isOver });
        this.setState({ fill: fill });
    }

    render() {
        return (
            <div className='left-nav-container' onMouseOver={() => this.handleMouse(true)} onMouseOut={() => this.handleMouse(false)}>
                <Nav className='left-nav-link' style={{ width: '100%' }}>
                    <LinkContainer to={this.props.route.path} style={{ width: '100%' }}>
                        <NavItem eventKey={this.props.index + 1}><NavIcons icon={this.props.route.glyph} fill={this.state.fill} /><b>{this.props.route.name}</b></NavItem>
                    </LinkContainer>
                    <Route key={this.props.index} path={this.props.route.path} exact={this.props.route.exact} component={this.props.route.sidebar} />
                </Nav>
            </div>
        )
    }
}

// const LeftNavInner = (props) => {
//     return (
//         <div className='left-nav-container'>
//             <Nav className='left-nav-link' style={{ width: '100%' }}>
//                 <LinkContainer to={props.route.path} style={{ width: '100%' }}>
//                     <NavItem eventKey={props.index + 1}><NavIcons icon={props.route.glyph} /><b>{props.route.name}</b></NavItem>
//                 </LinkContainer>
//                 <Route key={props.index} path={props.route.path} exact={props.route.exact} component={props.route.sidebar} />
//             </Nav>
//         </div>
//     )
// }

const LeftNav = (props) => {
    return (
        <div style={{ width: '100%' }}>
            {routes.map((route, index) =>
                <LeftNavInner key={route.name} route={route} index={index} />
            )}
        </div>
    )
}

export {
    Dashboard,
    LeftNav
}