import React from 'react';

class Chatbox extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            newMessage: "",
            chat: props.chat,
            name: props.name,
            scrollTop: null,
            refreshInterval: null,
        };
        this.handleMessageBoxChange = this.handleMessageBoxChange.bind(this)
        this.handleMessageBoxKeyPress = this.handleMessageBoxKeyPress.bind(this)
        this.handleSmiley = this.handleSmiley.bind(this)
    }

    componentDidMount() {
        this.scrollToBottom();
    }

    componentWillUnmount() {
        clearInterval(this.state.refreshInterval)
    }

    componentDidUpdate() {
        this.scrollToBottom();
    }

    static getDerivedStateFromProps(props, state) {
        if (props.chat && props.name) {
            if (props.chat !== state.chat || props.name !== state.name) {
                state.name = props.name;
                state.chat = props.chat;
            }
        }
        return state
    }

    handleMessageBoxChange(e) {
        this.setState({
            newMessage: e.target.value
        })
    }

    scrollToBottom = () => {
        this.messagesEnd.scrollIntoView({ behavior: "smooth", block: 'nearest', inline: 'start' });
    }

    handleMessageBoxKeyPress(e) {
        if (e.keyCode === 13) {
            const value = this.state.newMessage;
            const chatId = this.props.chatId;
            this.props.submitMessage(this.state.name, value, chatId);
            this.setState({
                newMessage: "",
            })
        }
    }

    handleSmiley() {
        var newMessage = this.state.newMessage;
        newMessage += " 🙂 ";
        this.setState({
            newMessage: newMessage
        })
    }

    render() {
        const chatbubbles = [];
        if (!this.state.chat) {
            return (<div className="chatbox " >
                <div className="bubble-container">
                    <p className="text-center white-text">Choose a conversation to show messages.</p>
                    <div style={{ float: "left", clear: "both" }}
                        ref={(el) => { this.messagesEnd = el; }}>
                    </div>
                </div>
            </div >)
        } else {
            for (const message of this.state.chat.messages) {
                const bubbleClassName = "chat-bubble " + (message.from === this.state.name ? "received" : "sent");
                chatbubbles.push(
                    <div className={bubbleClassName} key={message._id}>
                        <div className="chat-bubble-info">
                            {message.from}
                        </div>
                        <div className="chat-bubble-message">
                            {message.message}
                        </div>
                    </div>
                )
            }
            return (
                <div className="chatbox ">
                    <div className="bubble-container">
                        {chatbubbles}
                        <div style={{ float: "left", clear: "both" }}
                            ref={(el) => { this.messagesEnd = el; }}>
                        </div>
                    </div>
                    <div className="chat-text-box-container">
                        <input className="chat-text-box" placeholder="Enter your message here" value={this.state.newMessage} onChange={this.handleMessageBoxChange} onKeyUp={this.handleMessageBoxKeyPress} maxLength={256} />
                        <button className="smiley-button option-button" title="Send smiling face" onClick={this.handleSmiley}>🙂</button>
                        <div className="clearfix"></div>
                    </div>
                </div>
            )
        }
    }
}

export default Chatbox;