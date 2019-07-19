import React from 'react';
class Toast extends React.Component {

    constructor(props) {
        super(props);
        this.fadeOut = this.fadeOut.bind(this);
        this.state = {
            hidden: true,
            message: "",
            interval: setTimeout(this.fadeOut, 0),
            time: this.props.time,
        }
    }

    componentWillUnmount() {
        clearTimeout(this.state.interval);
        this.setState({
            interval: null
        })
    }

    componentDidUpdate() {
        if (this.props.time !== this.state.time) {
            if (this.props.message) {
                this.setState({
                    hidden: false,
                    message: this.props.message,
                    interval: setTimeout(this.fadeOut, this.props.toastDuration),
                    time: this.props.time,
                })
            }
        }
    }

    fadeOut() {
        this.setState({
            hidden: true
        })
    }

    render() {
        return (
            <div className={(this.state.hidden) ? "toast hidden" : "toast visible"} tabIndex="100">
                {this.state.message}
            </div >
        )
    }
}

export default Toast;