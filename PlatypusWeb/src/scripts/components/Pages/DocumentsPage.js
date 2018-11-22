import React from 'react';

export default class Document extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (
            <div>
                <form action="/action_page.php">
                    <input type="file" name="pic" accept="image/*" />
                    <input type="submit" />
                </form>
            </div>
        )
    }
}