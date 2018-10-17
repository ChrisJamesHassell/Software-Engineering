import React from 'react';
import ReactDom from 'react-dom';

class App extends React.Component{
    constructor(props){
        super(props);
    }
    render() {
        return(
            <div id="root1">Hello dar.</div>
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