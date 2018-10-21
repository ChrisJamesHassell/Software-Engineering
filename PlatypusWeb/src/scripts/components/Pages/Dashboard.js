import React from 'react';
import {Link} from 'react-router-dom';
import {RouteWithSubRoutes} from '../../routes';

const Dashboard = ({ routes }) => (
    <div style={{background: 'white'}}>
        <h3>Dashboard</h3>
        <ul>
            <li>
                <Link to="/dashboard/bus">Bus</Link>
            </li>
            <li>
                <Link to="/dashboard/cart">Cart</Link>
            </li>
        </ul>
        {routes.map((route, i) => <RouteWithSubRoutes key={i} {...route} />)}
    </div>
);

const Bus = () => <h3>Bus</h3>;
const Cart = () => <h3>Cart</h3>;

export {
    Dashboard,
    Bus,
    Cart
}