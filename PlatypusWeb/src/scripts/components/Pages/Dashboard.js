import React from 'react';
import { Link, Route } from 'react-router-dom';

const Dashboard = ({ routes }) => (
    <div style={{ background: 'white' }}>
        <h3>Dashboard</h3>
        <ul>
            <li>
                <Link to="/dashboard/bus">Bus</Link>
            </li>
            <li>
                <Link to="/dashboard/cart">Cart</Link>
            </li>
        </ul>
        <Route exact path="/dashboard" component={Bus} />
        {/* {routes.map((route, i) => <RouteWithSubRoutes key={i} {...route} />)} */}
        <Route path="/dashboard/bus" component={Bus} />
        <Route path="/dashboard/cart" component={Cart} />
    </div>
);

const Bus = () => <h3>Bus</h3>;
const Cart = () => <h3>Cart</h3>;

export {
    Dashboard,
    Bus,
    Cart
}