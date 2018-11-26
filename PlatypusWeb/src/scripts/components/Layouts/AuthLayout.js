import React from 'react';
import { Route } from 'react-router-dom';
import { NavItem, Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import routes from '../../routes';
import NavIcons from '../../../images/icons/NavIcons';

const Main = (props) => {
    return (
        <div id='main-div' style={{ height: props.mainHeight}}>
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

export class LeftNavInner extends React.Component {
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
        this.setState({ isMouseOver: isOver, fill: fill });
    }

    render() {
        return (
            <div className='left-nav-container' onMouseOver={() => this.handleMouse(true)} onMouseOut={() => this.handleMouse(false)}>
                <Nav className='left-nav-link'>
                    <LinkContainer to={this.props.route.path}>
                        <NavItem eventKey={this.props.index + 1}><NavIcons icon={this.props.route.glyph} fill={this.state.fill} /><b>{this.props.route.name}</b></NavItem>
                    </LinkContainer>
                    <Route key={this.props.index} path={this.props.route.path} exact={this.props.route.exact} component={this.props.route.sidebar} />
                </Nav>
            </div>
        )
    }
}

export const LeftNav = (props) => {
    return (
        <div id="left-nav-container">
            {routes.map((route, index) =>
                <LeftNavInner key={route.name} route={route} index={index} />
            )}
        </div>
    )
}

export function AuthLayout() {
    var mainHeight = (100 - ((60 / (60 + window.screen.availHeight)) * 100)).toString() + "%"
    return (
        <div id='content'>
            <div id='left-nav'>
                <LeftNav />
            </div>
            <Main mainHeight={mainHeight} />
        </div>
    );
}