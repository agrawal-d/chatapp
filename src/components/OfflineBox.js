import React from 'react';

class OfflineBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            online: this.props.online ? "online" : "offline",
            name: this.props.name
        }

    }

    componentDidUpdate(prevProps) {
        if (this.props.online !== prevProps.online || this.props.name !== prevProps.name) {
            this.setState({
                online: this.props.online ? "online" : "offline",
                name: this.props.name
            })
        }
    }


    render() {
        var onlineClass = "offline-alert " + this.state.online;
        if (this.state.name) {
            return (
                <div className={onlineClass}>{this.props.name} is {this.state.online}</div>
            )
        } else {
            return null;
        }
    }
}

export default OfflineBox;