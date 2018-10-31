import React from 'react';
import { Link, Route, Router } from 'react-router-dom';
import { Panel, Grid, Row, Col, Table } from 'react-bootstrap';
import { deleteAllCookies } from '../../fetchHelpers'
import routes from '../../routes'

function Dashboard() {
    var mainHeight = (100 - ((60/(60 + window.screen.availHeight)) * 100)).toString() + "%"
    return (
        // <div id='content' style={{ display: "flex", height: "100%", maxWidth: "100%", width: "100%" }}>
        <div id='content' style={{ height: "100%", maxWidth: "100%", width: "100%", background: "#f2f5f8" }}>
            <Grid id='main-grid' style={{ padding: "0px", margin: "0px", width: "100%", maxWidth: "100%" }}>
                <Row style={{ height: "100%", width: "100%", maxWidth: "100%", padding: "0px", margin: "0px" }}>
                    <Col xsHidden smHidden md={1} style={{ height: "100%", padding: "0px", margin: "0px" }}>
                        <LeftNav />
                    </Col>
                    <Col xs={12} md={11} style={{height: mainHeight, padding: "20px", margin: "0px", overflowY: "auto" }}>
                        <Main />
                    </Col>
                </Row>
            </Grid>
        </div>
    );
}

const LeftNav = (props) => {
    return (
        <div id='left-nav'
            style={{
                padding: "10px",
                height: "100%",
                margin: "0px",
                background: "#33363b"
            }}
        >
            <ul style={{ listStyleType: "none", padding: 0 }}>
                {routes.map((route) =>
                    <li key={route.name}>
                        <Link key={route.name} to={route.path}>{route.name}</Link>
                    </li>)}
            </ul>
            <button onClick={() => { deleteAllCookies(); window.location.reload(); }}>
                Sign out
        </button>

            {routes.map((route, index) => (
                // You can render a <Route> in as many places
                // as you want in your app. It will render along
                // with any other <Route>s that also match the URL.
                // So, a sidebar or breadcrumbs or anything else
                // that requires you to render multiple things
                // in multiple places at the same URL is nothing
                // more than multiple <Route>s.
                <Route
                    key={index}
                    path={route.path}
                    exact={route.exact}
                    component={route.sidebar}
                />
            ))}
        </div>
    )
}

const Main = (props) => {
    return (
        // <div style={{ flex: 1, padding: "10px", background: "#f2f5f8", maxWidth: "85%" }}>
        <div style={{ background: "#f2f5f8", margin: "0px", padding: "0px" }}>
            {routes.map((route, index) => (
                // Render more <Route>s with the same paths as
                // above, but different components this time.
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


export {
    Dashboard
}