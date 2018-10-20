import React from 'react';
import ReactDom from 'react-dom';

import AppNavbar from './scripts/Navbar/AppNavbar';
import AppJumbo from './scripts/Main/AppJumbo';
//import loginbg from './images/loginbg.png'
import './css/style.css';



class App extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div id="container">
                <AppNavbar />
                <AppJumbo />
            </div>
        )
    }
}

ReactDom.render(
    <App />,
    document.getElementById('root')
);


// Define the hot loader and that it should be used
// const AppWithHot = hot(module)(App);
//module.hot.accept();