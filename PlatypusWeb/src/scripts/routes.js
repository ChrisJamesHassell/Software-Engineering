import React from 'react';
import { Route } from "react-router-dom";
import { Dashboard, Bus, Cart } from './components/Pages/Dashboard';
import Login from './components/Pages/Login';
import LoginForm from './components/Forms/LoginForm';
import SignupForm from './components/Forms/SignupForm';
import logo from '../images/icons/logo_fill_white.svg';
// then our route config
const routes = [
    {
        path: "/login",
        component: Login,
        routes: [
            {
                path: "/login/login",
                component: LoginForm,
                logo: logo
            },
            {
                path: "/login/signup",
                component: SignupForm,
                logo: logo
            }
        ]
    },
    {
        path: "/dashboard",
        component: Dashboard,
        routes: [
            {
                path: "/dashboard/bus",
                component: Bus
            },
            {
                path: "/dashboard/cart",
                component: Cart
            }
        ]
    }
];

// wrap <Route> and use this everywhere instead, then when
// sub routes are added to any route it'll work
const RouteWithSubRoutes = (route) => (
    <Route
        path={route.path}
        render={(props) => (
            // pass the sub-routes down to keep nesting
            <route.component {...props} routes={route.routes} />
        )}
    />
);

export {
    routes,
    RouteWithSubRoutes
}