import React from 'react';
import Tasks from './components/Pages/Tasks';

const routes = [
    {
        path: "/dashboard",
        name: "Dashboard",
        exact: true,
        sidebar: () => <div></div>,
        main: () => <b>Main Dash Stuff</b>
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
        main: () => <b>Events Page</b>
    },
    {
        path: "/dashboard/appliances",
        name: "Appliances",
        sidebar: () => <div></div>,
        main: () => <b>Home and Appliances Page</b>
    },
    {
        path: "/dashboard/medical",
        name: "Medical",
        sidebar: () => <div></div>,
        main: () => <b>Medical Page</b>
    },
    {
        path: "/dashboard/auto",
        name: "Auto",
        sidebar: () => <div></div>,
        main: () => <b>Home and Appliances Page</b>
    },
    {
        path: "/dashboard/meals",
        name: "Meals",
        sidebar: () => <div></div>,
        main: () => <b>Meals</b>
    }
];
export default routes;
// const routes = [
//     {
//         path: "/login",
//         component: Login,
//         routes: [
//             {
//                 path: "/login/login",
//                 component: LoginForm,
//                 props: {

//                 }
//             },
//             {
//                 path: "/login/signup",
//                 component: SignupForm,
//                 props: {

//                 }
//             }
//         ]
//     },
//     {
//         path: "/dashboard",
//         component: Dashboard,
//         routes: [
//             {
//                 path: "/dashboard/bus",
//                 component: Bus
//             },
//             {
//                 path: "/dashboard/cart",
//                 component: Cart
//             }
//         ]
//     }
// ];

// // wrap <Route> and use this everywhere instead, then when
// // sub routes are added to any route it'll work
// const RouteWithSubRoutes = (route) => (
//     <Route
//         path={route.path}
//         render={(props) => (
//             // pass the sub-routes down to keep nesting
//             <route.component {...props} routes={route.routes} />
//         )}
//     />
// );

// export {
//     routes,
//     RouteWithSubRoutes
// }