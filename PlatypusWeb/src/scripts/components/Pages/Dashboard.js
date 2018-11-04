import React from 'react';
import { Link, Route, Router } from 'react-router-dom';
import { Panel, Grid, Row, Col, Table, NavItem, Button, Nav, Glyphicon } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { deleteAllCookies } from '../../fetchHelpers'
import routes from '../../routes'


function Dashboard() {
    var mainHeight = (100 - ((60 / (60 + window.screen.availHeight)) * 100)).toString() + "%"    
    return (
        <div id='content'>
            <Grid id='main-grid'>
                {/* <Row id='main-grid-row'> */}
                <div id='main-grid-row' style={{display: 'flex', width: '100%'}}>
                    {/* <Col id='left-nav' xsHidden sm={3} md={2} lg={1}> */}
                    <div id='left-nav' style={{minWidth: '210px'}}>
                        <LeftNav />
                    </div>
                    {/* </Col> */}
                    {/* <Col xs={12} sm={9} md={10} lg={11} style={{ height: mainHeight, padding: "20px", margin: "0px", overflowY: "auto" }}> */}
                    <Main mainHeight={mainHeight} />
                    {/* </Col> */}
                    </div>
                {/* </Row> */}
            </Grid>
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

const LeftNavInner = (props) => {
    // console.log("left nav props: ", props);
    return (
        <Nav className='left-nav-link' style={{width: '100%'}}>
            <LinkContainer to={props.route.path} style={{width: '100%'}}>
                <NavItem eventKey={props.index + 1}><Glyphicon className="left-nav-glyph" glyph={props.route.glyph} /><b>{props.route.name}</b></NavItem>
            </LinkContainer>

            <Route key={props.index} path={props.route.path} exact={props.route.exact} component={props.route.sidebar} />
        </Nav>
    )
}

const LeftNav = (props) => {
    return (
        <div style={{width: '100%'}}>
            {routes.map((route, index) =>
                <LeftNavInner key={route.name} route={route} index={index} />
            )}
            <Button style={{ width: "100%", borderRadius: "0" }} onClick={() => { deleteAllCookies(); window.location.reload(); }}>Sign out</Button>
        </div>
    )
}

export {
    Dashboard,
    LeftNav
}