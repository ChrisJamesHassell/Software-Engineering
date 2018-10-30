import React from 'react';
import { Link, Route, Router } from 'react-router-dom';
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
        main: () => <h2>Tasks Page</h2>
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
        <div style={{ display: "flex" }}>
            <div
                style={{
                    padding: "10px",
                    width: "15%",
                    background: "#f0f0f0"
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

            <div style={{ flex: 1, padding: "10px" }}>
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

// const Dashboard = ({ routes }) => (
//     <div style={{ background: 'white' }}>
//         <h3>Dashboard</h3>
//         <ul>
//             <li>
//                 <Link to="/dashboard/bus">Bus</Link>
//             </li>
//             <li>
//                 <Link to="/dashboard/cart">Cart</Link>
//             </li>
//         </ul>
//         <Route exact path="/dashboard" component={Bus} />
//         <Route path="/dashboard/bus" component={Bus} />
//         <Route path="/dashboard/cart" component={Cart} />
//         <button
//           onClick={() => {
//             deleteAllCookies();
//             window.location.reload();
//           }}
//         >
//           Sign out
//         </button>
//     </div>
// );

const Bus = () => <h3>Bus</h3>;
const Cart = () => <h3>Cart</h3>;

export {
    Dashboard,
    Bus,
    Cart
}