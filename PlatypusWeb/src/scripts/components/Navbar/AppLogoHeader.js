import React from 'react';
import { Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const AppLogoHeader = (props) => (
    <Navbar.Header>
        <Navbar.Brand id='logo-brand'>
            <img src={props.logo}  alt="white logo"></img>
            <Link to="/"><span id='brand-platy'>platy</span><span id='brand-pus'>pus</span></Link>
        </Navbar.Brand>
        <Navbar.Toggle />
    </Navbar.Header>
);

export default AppLogoHeader;