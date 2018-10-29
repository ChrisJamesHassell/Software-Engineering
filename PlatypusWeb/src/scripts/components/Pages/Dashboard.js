import React from 'react';
import { Link, Route } from 'react-router-dom';
import { deleteAllCookies } from '../../fetchHelpers'

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
        <Route path="/dashboard/bus" component={Bus} />
        <Route path="/dashboard/cart" component={Cart} />
        <button
          onClick={() => {
            deleteAllCookies();
            window.location.reload();
          }}
        >
          Sign out
        </button>
    </div>
);

const Bus = () => <h3>Bus</h3>;
const Cart = () => <h3>Cart</h3>;

export {
    Dashboard,
    Bus,
    Cart
}