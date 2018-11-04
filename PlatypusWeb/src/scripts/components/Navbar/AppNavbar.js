import React from 'react';
import AppLogoHeader from './AppLogoHeader';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem, Glyphicon } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import logo from '../../../images/icons/logo_fill_white.svg';
import { LeftNav } from '../Pages/Dashboard';
// #32a78d



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
                    </NavDropdown>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );

    // return (
    //     <Navbar collapseOnSelect style={navStyle} bsStyle={props.isAuth ? "inverse" : "default"}>
    //         <AppLogoHeader logo={logo} />
    //         <Navbar.Collapse>
    //             <Nav pullRight>
    //                 {!mobileNav && props.isAuth && <LinkContainer to="/"><NavItem eventKey={1}><Glyphicon glyph="home" /></NavItem></LinkContainer>}
    //                 {mobileNav && routes.map((route, index) =>
    //                     <LinkContainer key={route.name} to={route.path}><NavItem eventKey={index + 1}>{route.name}</NavItem></LinkContainer>)}
    //                 {mobileNav && routes.map((route, index) =>
    //                 <Route key={index} path={route.path} exact={route.exact} component={route.sidebar} />)}
    //                 <NavDropdown id='nav-profile-dropdown' eventKey={10} title={<span id='nav-profile'></span>} id='basic-nav-dropdown'>
    //                     <MenuItem eventKey={10.1}>Something1</MenuItem>
    //                     <MenuItem eventKey={10.2}>Something2</MenuItem>
    //                     <MenuItem divider />
    //                     <MenuItem eventKey={10.3}>Something3</MenuItem>
    //                 </NavDropdown>
    //             </Nav>
    //         </Navbar.Collapse>
    //     </Navbar>
    // );
}
//<Button onClick={() => { deleteAllCookies(); window.location.reload(); }}>Sign out</Button>



export default AppNavbar;