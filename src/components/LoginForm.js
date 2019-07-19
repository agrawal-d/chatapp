import React from 'react';
class Loginform extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            message: "",
            passwordInput: "",
            nameInput: "",
            newAccount: false
        }
        this.handleProceedButton = this.handleProceedButton.bind(this)
        this.handleNameChange = this.handleNameChange.bind(this)
        this.handlePasswordChange = this.handlePasswordChange.bind(this)
        this.handleNewAccountChange = this.handleNewAccountChange.bind(this)
        this.handleEnterkey = this.handleEnterkey.bind(this)
    }

    handleEnterkey(e) {
        if (e.keyCode === 13) {
            this.handleProceedButton()
        }
    }

    handleProceedButton() {
        this.props.handleProceedButton(this.state.nameInput, this.state.passwordInput, this.state.newAccount);
    }

    handleNameChange(e) {
        this.setState({
            nameInput: e.target.value
        })
    }

    handlePasswordChange(e) {
        this.setState({
            passwordInput: e.target.value
        })
    }

    handleNewAccountChange(e) {
        this.setState({
            newAccount: e.target.checked
        })
    }

    render() {
        return (
            <div className="chat-app container login">
                <form onSubmit={(e) => { e.preventDefault() }}>
                    <h1 className="login-text">Welcome to Chat</h1>
                    <p className="login-subtext">Login or Create an Account to start chatting.<br /> Enter your username and password or create new ones, and an account will be created for you.</p>
                    <input className="login-field theme-input" placeholder="Full Name" maxLength="64" value={this.state.nameInput} onChange={this.handleNameChange} />
                    <input className="login-field theme-input" type="password" onKeyUp={this.handleEnterkey} placeholder="Password" maxLength="128" value={this.state.passwordInput} onChange={this.handlePasswordChange} />
                    <br />
                    <button className="theme-btn login-field" onClick={this.handleProceedButton}>Proceed</button>
                    <br />
                    <input type="checkbox" className="checkbox" id="new-account" checked={this.state.newAccount} onChange={this.handleNewAccountChange} />
                    <label htmlFor="new-account">&nbsp;Create a new account</label>
                    <br />
                    <p className="message">{this.props.message}</p>
                    <small>&copy; 2019 Diyanshu Agrawal. All rights reserved.</small>
                </form>
            </div >
        )
    }
}

export default Loginform;