import React from 'react';
import './bootstrap-grid.css';
import './App.css';
import loading from './loading.gif'
const axios = require('axios');


class Toast extends React.Component {

  constructor(props) {
    super(props);
    this.fadeOut = this.fadeOut.bind(this);
    this.state = {
      hidden: false
    }
  }

  componentDidMount() {
    this.interval = setInterval(this.fadeOut, 5000)
  }

  componentWillUnmount() {
    clearInterval(this.interval);
    this.interval = null;
  }

  fadeOut() {
    this.setState({
      hidden: true
    })
  }

  render() {
    return (
      <div className={(this.state.hidden) ? "toast hidden" : "toast visible"} tabIndex="100">
        {this.props.message}
      </div >
    )
  }
}


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



  }
  handleProceedButton() {
    this.props.handleProceedButton(this.state.nameInput, this.state.passwordInput, this.state.newAccount);
    // @todo fix above
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
        <Toast message='This application is still in development' />
        <h1 className="login-text">Welcome to Chat</h1>
        <p className="login-subtext">Login or Create an Account to start chatting.<br /> Enter your username and password or create new ones, and an account will be created for you.</p>
        <input className="login-field theme-input" placeholder="Full Name" maxLength="64" value={this.state.nameInput} onChange={this.handleNameChange} />
        <input className="login-field theme-input" type="password" placeholder="Password" maxLength="128" value={this.state.passwordInput} onChange={this.handlePasswordChange} />
        <br />
        <button className="theme-btn login-field" onClick={this.handleProceedButton}>Proceed</button>
        <br />
        <input type="checkbox" className="checkbox" id="new-account" checked={this.state.newAccount} onChange={this.handleNewAccountChange} />
        <label htmlFor="new-account">&nbsp;Create a new account</label>
        <br />
        <p className="message">{this.props.message}</p>
        <small>&copy; 2019 Diyanshu Agrawal. All rights reserved.</small>
      </div >

    )
  }
}

class Chatbox extends React.Component {

  render() {
    const chatbubbles = [];
    if (!this.props.chat) {
      return (<div className="chatbox " >
        <div className="bubble-container">
          <p className  ="text-center white-texr">Choose a conversation to show messages.</p>

        </div>
        <div className="chat-text-box-container">
          <input className="chat-text-box" placeholder="Enter your message here" />
          <button className="option-button" title="Send smiling face">🙂</button>
          <div className="clearfix"></div>
        </div>
      </div >)
    } else {
      for (const message of this.props.chat.messages) {
        const bubbleClassName = "chat-bubble " + (message.from === this.props.name ? "received" : "sent");
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

          </div>
          <div className="chat-text-box-container">
            <input className="chat-text-box" placeholder="Enter your message here" />
            <button className="option-button" title="Send smiling face">🙂</button>
            <div className="clearfix"></div>
          </div>
        </div>

      )
    }


  }
}

class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.activate = this.activate.bind(this);
  }

  activate() {
    // this.props.onActivate();
    this.props.onActivate(this.props.name)
  }
  render() {
    return (
      <li className={(this.props.active) ? "active" : ""} onClick={this.activate}>{this.props.name}</li>
    )
  }
}

class ChatApp extends React.Component {


  constructor(props) {
    super(props);
    this.activate = this.activate.bind(this);
    this.state = {
      toast: null,
      active: null,
      activeChatIndex: -1,
      globalSettings: {
        name: "Divyanshu Agrawal",
        id: null,
        email: null,
        accessKey: null,
        loggedIn: null,
        serverRoot: "http://localhost:3000/",
      },
      chats: [

      ]

    }

    this.handleProceedButton = this.handleProceedButton.bind(this);
  }

  componentDidMount() {

  }

  handleProceedButton(name, password, newAccount) {
    this.setState({
      loginFormMessage: (
        <span>
          <img src={loading} className="loading" alt="..." />
          <span>Please wait, attempting to log you in...  </span>
        </span>
      )
    })
    axios.post(this.state.globalSettings.serverRoot + "login", {
      name: name,
      password: password,
      newAccount: newAccount,
      withCredentials: true,
    }, {
        withCredentials: true
      }).then(
        (response) => {
          if (response.data.error) {
            this.setState({
              loginFormMessage: response.data.error
            })
            console.error("Login attempt response error : ", response.data);
            return;
          }
          const seti = this.state.globalSettings;
          seti.loggedIn = true;
          this.setState({
            globalSettings: seti,
            newAccount: response.data.newAccount
          })

          axios.get(`${this.state.globalSettings.serverRoot}my-chats`, {
            withCredentials: true
          }, {
              withCredentials: true
            }).then((response) => {
              if (response.data.error) {
                this.setState({
                  toast: "An error occurred while trying to load your chats\n, please try again."
                })
                console.error("Login", response.data.error)
                return;
              } else {
                const newState = this.state;
                newState.chats = response.data;
                this.setState(newState);
              }

            }).catch(function (error) {
              alert("An error occured while fetching your chats, please reload the app");
              console.error("Fetching chats", error);
            })

        }
      ).catch(function (error) {
        console.error("OOPS", error)
        this.setState({
          toast: error
        })

      })
  }



  activate(name) {
    this.setState({
      active: name
    })
    var index = -1;
    this.state.chats.find(function (item, i) {
      if (item.name === name) {
        index = i;
        return i;
      } else {
        return -1;
      }
    })
    this.setState({
      activeChatIndex: index
    })
  }

  render() {
    var additionalRenders;
    if (this.state.newAccount) {
      additionalRenders = <Toast message="A new account was created for you. Welcome to Chat" />;
      console.log("New Account")
    }
    if (!this.state.globalSettings.loggedIn) {
      return (
        <Loginform globalSettings={this.state.globalSettings} handleProceedButton={this.handleProceedButton} message={this.state.loginFormMessage}></Loginform>
      )
    } else {
      var chats = [];
      for (var element of this.state.chats) {
        chats.push(
          <Chat name={element.name} onActivate={this.activate} globalSettings={this.state.globalSettings} active={(element.name === this.state.active)} key={element.name} />
        )
      }
      if (chats.length === 0) {
        chats = <p className="no-chats text-center padding-10 color-white">
          <img className="loading" src={loading} alt="..." />
          Downloading conversations...</p>
      } else {

      }

      return (
        <div className="chat-app container">
          {additionalRenders}
          <div className="row app-row">
            <div className="col-4 chats">
              <div className="chats-inner">
                <input className="theme-btn chat-search" placeholder="Search for people" />
                <ul>
                  {chats}
                </ul>
              </div>


            </div>
            <div className="col-8">
              <Chatbox name={this.state.active} globalSettings={this.state.globalSettings} chat={this.state.chats[this.state.activeChatIndex]}></Chatbox>
            </div>
          </div>


        </div>)
    }
  }
}

function App() {
  return (
    <ChatApp />
  );
}

export default App;
