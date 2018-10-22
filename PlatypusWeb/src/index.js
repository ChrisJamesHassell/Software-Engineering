import React from "react";
import ReactDom from "react-dom";
import * as serviceWorker from "./registerServiceWorker";

class App extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <div id="root1">Hello dar.</div>;
    }
}

ReactDom.render(<App />, document.getElementById("root"));

serviceWorker.register();
