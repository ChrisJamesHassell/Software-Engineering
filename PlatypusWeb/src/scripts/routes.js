import React from 'react';
// import { Glyphicon } from 'react-bootstrap';
import { MenuItem } from 'react-bootstrap';
import Tasks from './components/Pages/Tasks';
import Dash from './components/Pages/DashPage';
import { Events } from './components/Pages/EventsPage';
import Document from './components/Pages/DocumentsPage';
import Category from './components/Layouts/CategoryLayout';
// import * as Icons from '../images/icons/NavIcons';
// import NavIcons from '../images/icons/NavIcons';

// const iconStyle = { width: 20, height: 20 };
const routes = [
  {
    path: "",
    name: 'Navigation',
    type: 'divider',
    glyph: "",
    sidebar: () => <div><MenuItem divider /><div className='left-nav-divider'>Navigation</div></div>
  },
  {
    path: '/dashboard',
    name: 'Dash',
    exact: true,
    glyph: 'dashboard',
    type: 'home',
    sidebar: () => <div />,
    main: () => <Dash />,
  },
  {
    path: "",
    name: 'Categories',
    type: 'divider',
    glyph: "",
    sidebar: () => <div><MenuItem divider /><div className='left-nav-divider'>Categories</div></div>
  },
  {
    path: '/dashboard/appliances',
    name: 'Appliances',
    glyph: 'appliances', // <Icons.Appliances {...iconStyle} />,
    type: 'Category',
    sidebar: () => <div />,
    main: () => <Category category="APPLIANCES" />,
  },
  {
    path: '/dashboard/auto',
    name: 'Auto',
    glyph: 'auto', // <Icons.Auto {...iconStyle} />,
    type: 'Category',
    sidebar: () => <div />,
    main: () => <Category category="AUTO" />,
  },
  {
    path: '/dashboard/meals',
    name: 'Meals',
    glyph: 'meals', // <Icons.Meals {...iconStyle} />,
    type: 'Category',
    sidebar: () => <div />,
    main: () => <Category category="MEALS" />,
  },
  {
    path: '/dashboard/medical',
    name: 'Medical',
    glyph: 'medical', // <Icons.Medical {...iconStyle} />,
    type: 'Category',
    sidebar: () => <div />,
    main: () => <Category category="MEDICAL" />,
  },
  {
    path: '/dashboard/miscellaneous',
    name: 'Miscellaneous',
    glyph: 'miscellaneous', // <Icons.Meals {...iconStyle} />,
    type: 'Category',
    sidebar: () => <div />,
    main: () => <Category category="MISCELLANEOUS" />,
  },
  {
    path: "",
    name: 'Actions',
    type: 'divider',
    glyph: "",
    sidebar: () => <div><MenuItem divider /><div className='left-nav-divider'>Actions</div></div>
  },
  {
    path: '/dashboard/documents',
    name: 'Documents',
    glyph: 'documents', // <Icons.Events {...iconStyle} />,
    type: 'Actions',
    sidebar: () => <div />,
    main: () => <Document />,
  },
  {
    path: '/dashboard/events',
    name: 'Events',
    glyph: 'events', // <Icons.Events {...iconStyle} />,
    type: 'Actions',
    sidebar: () => <div />,
    main: () => <Events />,
  },
  {
    path: '/dashboard/tasks',
    name: 'Tasks',
    glyph: 'tasks', // <Icons.Tasks {...iconStyle} />,
    type: 'Actions',
    sidebar: () => <div />,
    main: () => <Tasks />,
  },
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
