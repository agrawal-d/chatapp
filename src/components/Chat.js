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
        const ref = "#" + this.props.name;
        return (
            <li c
                className={(this.props.active) ? "active" : ""}
                onClick={this.activate}
                href={ref}
                id={this.props.name}
            >
                {this.props.name}
            </li>
        )
    }
}

export default Chat;
