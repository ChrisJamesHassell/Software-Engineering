import React from 'react';
import AppLogoHeader from './AppLogoHeader';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { RouteWithSubRoutes, routes } from '../../routes';
import logo from '../../../images/icons/logo_fill_white.svg';
import { getHomePath } from '../../fetchHelpers';

const AppNavbar = () => {
    return (
        <Navbar collapseOnSelect style={{ marginBottom: '0', borderRadius: '0' }}>
            <AppLogoHeader logo={logo} />
            <Navbar.Collapse>
                <Nav>
                    <LinkContainer to="/"><NavItem eventKey={2}>{window.location.pathname.includes('login') ? 'Login' : 'Dashboard'}</NavItem></LinkContainer>
                    <NavDropdown eventKey={3} title='Dropdown' id='basic-nav-dropdown'>
                        <MenuItem eventKey={3.1}>Something1</MenuItem>
                        <MenuItem eventKey={3.2}>Something2</MenuItem>
                        <MenuItem divider />
                        <MenuItem eventKey={3.3}>Something3</MenuItem>
                    </NavDropdown>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}

export default AppNavbar;