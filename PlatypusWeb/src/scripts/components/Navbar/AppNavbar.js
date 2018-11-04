import React from 'react';
import {
  Navbar, Nav, NavItem, NavDropdown, MenuItem, Glyphicon,
} from 'react-bootstrap';
import { Route } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import AppLogoHeader from './AppLogoHeader';
import logo from '../../../images/icons/logo_fill_white.svg';
import routes from '../../routes';
// #32a78d


const AppNavbar = (props) => {
  const { availWidth } = window.screen;
  const mobileNav = props.isAuth && availWidth < 768;
  const navStyle = {
    marginBottom: '0',
    borderRadius: '0',
  };
  if (!props.isAuth && availWidth < 768) navStyle.display = 'none';

  return (
    <Navbar collapseOnSelect style={navStyle} bsStyle={props.isAuth ? 'inverse' : 'default'}>
      <AppLogoHeader logo={logo} />
      <Navbar.Collapse>
        <Nav pullRight>
          {!mobileNav && props.isAuth && <LinkContainer to="/"><NavItem eventKey={1}><Glyphicon glyph="home" /></NavItem></LinkContainer>}
          {mobileNav && routes.map((route, index) => (
            <LinkContainer key={route.name} to={route.path}>
              <NavItem eventKey={index + 1}>{route.name}</NavItem>
            </LinkContainer>
          ))}
          {mobileNav && routes.map((route, index) => (
            <Route key={index} path={route.path} exact={route.exact} component={route.sidebar} />
          ))}
          <NavDropdown id='nav-profile-dropdown' eventKey={10} title={<span id='nav-profile'></span>}>
            <MenuItem eventKey={10.1}>Something1</MenuItem>
            <MenuItem eventKey={10.2}>Something2</MenuItem>
            <MenuItem divider />
            <MenuItem eventKey={10.3}>Something3</MenuItem>
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default AppNavbar;
