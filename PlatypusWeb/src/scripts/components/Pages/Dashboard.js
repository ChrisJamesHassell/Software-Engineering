import React from 'react';
import { Link, Route, Router } from 'react-router-dom';
import { Panel, Grid, Row, Col, Table } from 'react-bootstrap';
import { deleteAllCookies } from '../../fetchHelpers'
import routes from '../../routes'

// function Dashboard() {
//     var mainHeight = (100 - ((60/(60 + window.screen.availHeight)) * 100)).toString() + "%"
//     return (
//         <div id='content' style={{ height: "100%", maxWidth: "100%", width: "100%", background: "#f2f5f8" }}>
//             <Grid id='main-grid' style={{ padding: "0px", margin: "0px", width: "100%", maxWidth: "100%" }}>
//                 <Row id='main-grid-row' style={{ height: "100%", width: "100%", maxWidth: "100%", padding: "0px", margin: "0px" }}>
//                     <Col id='left-nav-col' xsHidden smHidden md={1} style={{ height: "100%", padding: "0px", margin: "0px" }}>
//                         <LeftNav />
//                     </Col>
//                     <Col xs={12} md={11} style={{height: mainHeight, padding: "20px", margin: "0px", overflowY: "auto" }}>
//                         <Main />
//                     </Col>
//                 </Row>
//             </Grid>
//         </div>
//     );
// }
function Dashboard() {
    var mainHeight = (100 - ((60 / (60 + window.screen.availHeight)) * 100)).toString() + "%"
    return (
        <div id='content'>
            <Grid id='main-grid'>
                <Row id='main-grid-row'>
                    <LeftNav />
                    <Main mainHeight={mainHeight} />
                </Row>
            </Grid>
        </div>
    );
}

const LeftNav = (props) => {
    return (
        <Col id='left-nav' xsHidden smHidden md={1}>
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
                <Route
                    key={index}
                    path={route.path}
                    exact={route.exact}
                    component={route.sidebar}
                />
            ))}
        </Col>
    )
}

const Main = (props) => {
    return (
        <Col xs={12} md={11} style={{ height: props.mainHeight, padding: "20px", margin: "0px", overflowY: "auto" }}>
            <div id='main-div'>
                {routes.map((route, index) => (
                    <Route
                        key={index}
                        path={route.path}
                        exact={route.exact}
                        component={route.main}
                    />
                ))}
            </div>
        </Col>
    )
}


export {
    Dashboard
}