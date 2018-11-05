import React from 'react';
import AppLogoHeader from './AppLogoHeader';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem, Glyphicon, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import logo from '../../../images/icons/logo_fill_white.svg';
import { LeftNav } from '../Pages/Dashboard';
import {deleteAllCookies} from '../../fetchHelpers';

const AppNavbar = (props) => {
    var availWidth = window.screen.availWidth;
    var mobileNav = props.isAuth && availWidth < 768;
    var showHome = !mobileNav && props.isAuth;
    const navStyle = {
        'marginBottom': '0',
        'borderRadius': '0'
    }
    if (!props.isAuth && availWidth < 768) navStyle['display'] = 'none';

    return (
        <Navbar collapseOnSelect style={navStyle} bsStyle={props.isAuth ? "inverse" : "default"}>
            <AppLogoHeader logo={logo} />
            <Navbar.Collapse>
                <Nav pullRight>
                    {showHome && <LinkContainer id='nav-home' to="/"><NavItem eventKey={1}><Glyphicon glyph="home" /></NavItem></LinkContainer>}
                    {mobileNav && <LeftNav />}
                    <NavDropdown id='nav-profile-dropdown' eventKey={10} title={<span id='nav-profile'></span>} id='basic-nav-dropdown'>
                        <MenuItem eventKey={10.1}>Something1</MenuItem>
                        <MenuItem eventKey={10.2}>Something2</MenuItem>
                        <MenuItem divider />
                        <MenuItem eventKey={10.3}>Something3</MenuItem>
                        <Button style={{ width: "100%", borderRadius: "0" }} onClick={() => { deleteAllCookies(); window.location.reload(); }}>Sign out</Button>
                    </NavDropdown>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}
export default AppNavbar;