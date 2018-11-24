import React from 'react';
import moment from 'moment';

export default class Document extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (
            <div>
                <div>
                    <form action="http://localhost:8080/api/app/doc/add" method="post" enctype="multipart/form-data">
                        <input type="hidden" name="userID" value="blah" />
                        <input type="hidden" name="documentID" value="123" />
                        <input type="hidden" name="pinned" value={1} />
                        <input type="hidden" name="groupID" value={24} />
                        <input type="hidden" name="name" value="stupidname" />
                        <input type="hidden" name="category" value="APPLIANCES" />
                        <input type="hidden" name="expirationDate" value={null} />
                        <input type="file" name="FILE" accept="image/*" />
                        <input type="submit" />
                    </form>
                </div>
                    
                <div className="image-go-here">
                </div>
            </div>
        )
    }
}