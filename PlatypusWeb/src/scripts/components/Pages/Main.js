import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { RouteWithSubRoutes } from '../../routes';
import logo from '../../../images/icons/logo_fill_white.svg';

const Main = (props) => (
    <Router>
        <div id="container">
            <Navbar collapseOnSelect style={{ marginBottom: '0', borderRadius: '0' }}>
                <Navbar.Header>
                    <Navbar.Brand id='logo-brand'>
                        <img src={logo}></img>
                        <Link to="/"><span id='brand-platy'>platy</span><span id='brand-pus'>pus</span></Link>
                    </Navbar.Brand>
                    <Navbar.Toggle />
                </Navbar.Header>
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
            <Route exact path="/" component={props.routes[0].component} />
            {props.routes.map((route, i) => <RouteWithSubRoutes key={i} {...route} />)}
        </div>
    </Router>
);

export default Main;
