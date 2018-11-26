import React from 'react';
import { Route } from 'react-router-dom';
import { NavItem, Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import NavIcons from '../../../images/icons/NavIcons';
import routes from '../../routes';

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
        this.setState({ isMouseOver: isOver, fill: fill });
    }

    render() {
        return (
            <div className='left-nav-container' onMouseOver={() => this.handleMouse(true)} onMouseOut={() => this.handleMouse(false)}>
                <Nav className='left-nav-link'>
                    {this.props.route.type !== 'divider' && <LinkContainer to={this.props.route.path}>
                        <NavItem eventKey={this.props.index + 1}><NavIcons icon={this.props.route.glyph} fill={this.state.fill} />{this.props.route.name}</NavItem>
                    </LinkContainer>
                    } 
                </Nav>
                <Route key={this.props.index} path={this.props.route.path} exact={this.props.route.exact} component={this.props.route.sidebar} />
            </div>
        )
    }
}

export const LeftNav = (props) => {
    return (
        <div id="left-nav-container">
            {routes.map((route, index) =>
                <LeftNavInner key={`${route.name}-${index}`} route={route} index={index} />
            )}
        </div>
    )
}