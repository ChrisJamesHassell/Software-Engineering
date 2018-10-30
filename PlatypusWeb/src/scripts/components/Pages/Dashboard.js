import React from 'react';
import { Link, Route, Router } from 'react-router-dom';
import { Panel, Grid, Row, Col, Table } from 'react-bootstrap';
import { deleteAllCookies } from '../../fetchHelpers'

const routes = [
    {
        path: "/dashboard",
        name: "Dashboard",
        exact: true,
        sidebar: () => <div></div>,
        main: () => <h2>Main Dash Stuff</h2>
    },
    {
        path: "/dashboard/tasks",
        name: "Tasks",
        sidebar: () => <div></div>,
        main: () => <Tasks />
    },
    {
        path: "/dashboard/events",
        name: "Events",
        sidebar: () => <div></div>,
        main: () => <h2>Events Page</h2>
    },
    {
        path: "/dashboard/appliances",
        name: "Appliances",
        sidebar: () => <div></div>,
        main: () => <h2>Home and Appliances Page</h2>
    },
    {
        path: "/dashboard/medical",
        name: "Medical",
        sidebar: () => <div></div>,
        main: () => <h2>Medical Page</h2>
    },
    {
        path: "/dashboard/auto",
        name: "Auto",
        sidebar: () => <div></div>,
        main: () => <h2>Home and Appliances Page</h2>
    },
    {
        path: "/dashboard/meals",
        name: "Meals",
        sidebar: () => <div></div>,
        main: () => <h2>Meals</h2>
    }
];

function Dashboard() {
    return (
        <div style={{ display: "flex", height: "100%" }}>
            <div
                style={{
                    padding: "10px",
                    width: "15%",
                    height: "100%",
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

            <div style={{ flex: 1, padding: "10px", background: "#f2f5f8" }}>
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
        </div>
    );
}

const Tasks = (props) => {
    return (
        <div id="my-tasks">
            <Panel bsStyle="success">
                <Panel.Heading>
                    <Panel.Title componentClass="h3">My Tasks</Panel.Title>
                </Panel.Heading>
                <Panel.Body>
                    Here is where the person's tasks go
                    <Table responsive>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Table heading</th>
                                <th>Table heading</th>
                                <th>Table heading</th>
                                <th>Table heading</th>
                                <th>Table heading</th>
                                <th>Table heading</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>1</td>
                                <td>Table cell</td>
                                <td>Table cell</td>
                                <td>Table cell</td>
                                <td>Table cell</td>
                                <td>Table cell</td>
                                <td>Table cell</td>
                            </tr>
                            <tr>
                                <td>2</td>
                                <td>Table cell</td>
                                <td>Table cell</td>
                                <td>Table cell</td>
                                <td>Table cell</td>
                                <td>Table cell</td>
                                <td>Table cell</td>
                            </tr>
                            <tr>
                                <td>3</td>
                                <td>Table cell</td>
                                <td>Table cell</td>
                                <td>Table cell</td>
                                <td>Table cell</td>
                                <td>Table cell</td>
                                <td>Table cell</td>
                            </tr>
                        </tbody>
                    </Table>
                </Panel.Body>
            </Panel>

            <Panel bsStyle="info">
                <Panel.Heading>
                    <Panel.Title componentClass="h3">Group Tasks</Panel.Title>
                </Panel.Heading>
                <Panel.Body>
                    Whatever the fuck Johnathan wants to do.
                    <Table responsive>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Table heading</th>
                                <th>Table heading</th>
                                <th>Table heading</th>
                                <th>Table heading</th>
                                <th>Table heading</th>
                                <th>Table heading</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>1</td>
                                <td>Table cell</td>
                                <td>Table cell</td>
                                <td>Table cell</td>
                                <td>Table cell</td>
                                <td>Table cell</td>
                                <td>Table cell</td>
                            </tr>
                            <tr>
                                <td>2</td>
                                <td>Table cell</td>
                                <td>Table cell</td>
                                <td>Table cell</td>
                                <td>Table cell</td>
                                <td>Table cell</td>
                                <td>Table cell</td>
                            </tr>
                            <tr>
                                <td>3</td>
                                <td>Table cell</td>
                                <td>Table cell</td>
                                <td>Table cell</td>
                                <td>Table cell</td>
                                <td>Table cell</td>
                                <td>Table cell</td>
                            </tr>
                        </tbody>
                    </Table>
                </Panel.Body>
            </Panel>
        </div>
    )
}

export {
    Dashboard
}