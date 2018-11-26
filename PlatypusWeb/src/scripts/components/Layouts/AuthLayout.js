import React from 'react';
import { Route } from 'react-router-dom';
import routes from '../../routes';
import { LeftNav } from '../Navbar/LeftNav';

const Main = (props) => {
    return (
        <div id='main-div' style={{ height: props.mainHeight }}>
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

export function AuthLayout() {
    var mainHeight = (100 - ((60 / (60 + window.screen.availHeight)) * 100)).toString() + "%"
    return (
        <div id='content'>
            <div id='left-nav'>
                <LeftNav />
            </div>
            <Main mainHeight={mainHeight} />
        </div>
    );
}