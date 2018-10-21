import React from 'react';
import ReactDom from 'react-dom';
import { Router, Route, hashHistory } from 'react-router'
import AppNavbar from './scripts/components/Navbar/AppNavbar';
import AppJumbo from './scripts/components/Main/AppJumbo';
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