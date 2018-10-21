import React from 'react';
import { BrowserRouter as Router, Route, Link, Redirect, withRouter } from "react-router-dom";
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { RouteWithSubRoutes, routes } from '../../routes';
import { Dashboard } from './Dashboard';
import Login from './Login';
import AppLogoHeader from '../Navbar/AppLogoHeader';

/**************************************/
//  We want to:
// ----------------------------------- //
//  1. Check to see if user is logged in (dash)
//  2. If not, display login page
//  3. If yes, display Dashboard


const Main = (props) => (
    <Router>
        <div id="container">
            <Navbar collapseOnSelect style={{ marginBottom: '0', borderRadius: '0' }}>
                <AppLogoHeader logo={props.logo} />
                <Navbar.Collapse>
                    <Nav>
                        <LinkContainer to="/dashboard"><NavItem eventKey={1}>Dashboard</NavItem></LinkContainer>
                        <LinkContainer to="/"><NavItem eventKey={2}>Home (login)</NavItem></LinkContainer>
                        <NavDropdown eventKey={3} title='Dropdown' id='basic-nav-dropdown'>
                            <MenuItem eventKey={3.1}>Something1</MenuItem>
                            <MenuItem eventKey={3.2}>Something2</MenuItem>
                            <MenuItem divider />
                            <MenuItem eventKey={3.3}>Something3</MenuItem>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
            <Route exact path="/" component={Login} logo={props.logo} />
            {routes.map((route, i) => <RouteWithSubRoutes key={i} {...route} />)}
        </div>
    </Router>
);

export default Main;
