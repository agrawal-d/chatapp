import React from 'react';

class Chat extends React.Component {

    constructor(props) {
        super(props);
        this.activate = this.activate.bind(this);
    }

    activate() {
        this.props.onActivate(this.props.name)
    }

    render() {
        return (
            <li className={(this.props.active) ? "active" : ""} onClick={this.activate}>{this.props.name}</li>
        )
    }
}

export default Chat;
