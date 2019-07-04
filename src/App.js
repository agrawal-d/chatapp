import React from 'react';
import './bootstrap-grid.css';
import './App.css';
import loading from './loading.gif'
import loadingBlack from './loading-black.gif'

import { throwStatement, tsMethodSignature } from '@babel/types';
const axios = require('axios');


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
    this.state.interval = null;
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

  // static getDerivedStateFromProps(props, state) {
  //   if (props.message !== state.message) {
  //     state.hidden = false;
  //     state.message = props.message;
  //     state.interval = setInterval(this.fadeOut, 5000);
  //   }
  //   return state
  // }

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
        <input className="login-field theme-input" type="password" onKeyUp={this.handleEnterkey} placeholder="Password" maxLength="128" value={this.state.passwordInput} onChange={this.handlePasswordChange} />
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

  constructor(props) {
    super(props);
    this.state = {
      newMessage: "",
      chat: props.chat,
      name: props.name,
      scrollTop: null,
    };

    this.handleMessageBoxChange = this.handleMessageBoxChange.bind(this)
    this.handleMessageBoxKeyPress = this.handleMessageBoxKeyPress.bind(this)
    this.fetchNewMessages = this.fetchNewMessages.bind(this)
    this.handleSmiley = this.handleSmiley.bind(this)
  }

  componentDidMount() {
    this.setState({
      refreshInterval: setInterval(this.fetchNewMessages, 2000)
    })
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

  fetchNewMessages() {
    if (this.state.chat) {
      this.props.fetchNewMessagesForActiveChat(this.state.name, this.state.chat.messages[0].chatId, this.state.chat.messages[this.state.chat.messages.length - 1].date);
    }

  }

  handleMessageBoxChange(e) {
    this.setState({
      newMessage: e.target.value
    })
  }

  scrollToBottom = () => {
    this.messagesEnd.scrollIntoView({ behavior: "smooth", block: 'nearest', inline: 'start' });
  }

  // SubmitMessage
  handleMessageBoxKeyPress(e) {
    if (e.keyCode === 13) {
      const value = this.state.newMessage;
      const chatId = this.state.chat.messages[0].chatId;
      this.props.submitMessage(this.state.name, value, chatId);
      const chat = this.state.chat;
      // chat.messages.push({
      //   from: <span><img src={loadingBlack} style={{ width: "10px", height: "10px", verticalAlign: "middle" }} /> Sending</span>,
      //   message: value,
      //   date: chat.messages[chat.messages.length - 1].date,
      //   _id: chat.messages[chat.messages.length - 1].date + Math.random(),
      // })
      this.setState({
        newMessage: "",
        chat: chat,
      })
    }
  }

  handleSmiley() {
    var newMessage = this.state.newMessage;
    newMessage += " 🙂 ";
    this.setState({
      newMessage: newMessage
    })
    console.log("Smiley")
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


function Results(props) {
  if (props.status.focus) {
    return (
      <div>
        <div className="search-result visible">
          <div className="search-results-list">
            {props.status.resultElement}
          </div>
        </div>
      </div >

    )
  } else {
    return (
      <div></div>
    )
  }

}


class SearchResults extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      query: "",
      visible: false,
      result: "",
      id: "search-input",
      resultElement: <span>Press enter to search, and only an exact match will appear for privacy.</span>
    };


    this.doSearch = this.doSearch.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleFocus = this.handleFocus.bind(this)
    this.handleBlur = this.handleBlur.bind(this)



  }

  handleBlur() {
    this.setState({
      focus: false,
      query: ""
    })
  }

  handleFocus() {
    this.setState({
      focus: true,
    })


  }

  doSearch(query) {
    const people = this.props.people;
  }

  handleInputChange(e) {
    this.setState({
      query: e.target.value
    })
  }

  handleSubmit(e) { // For new chat search
    if (e.keyCode == 13) {
      const query = this.state.query;
      axios.post(`${this.props.globalSettings.serverRoot}my-chats/search`, {
        query: query,
        people: this.props.people,
        withCredentials: true
      }, {
          withCredentials: true
        }).then((response) => {
          this.props.handleSearchResult(response)
        }).catch((error) => {
          console.error("Searching", error)
        })
      this.setState({
        query: " "
      })
    }
  }

  render() {
    return (
      <div>
        <input className="theme-btn chat-search" placeholder="Search for people" onChange={this.handleInputChange} onKeyUp={this.handleSubmit} value={this.state.query} onFocus={this.handleFocus} onBlur={this.handleBlur} />
        <Results status={this.state} />
      </div>
    )
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
      chatInterval: null,
      notDownloaded: true,
      toast: null,
      toastTime: Math.random(),
      toastDuration: 5000,
      active: null,
      activeChatIndex: -1,
      globalSettings: {
        name: null,
        id: null,
        email: null,
        accessKey: null,
        loggedIn: null,
        serverRoot: "https://chat-app-hereisdx.herokuapp.com/",
      },
      chats: [

      ]

    }

    this.handleProceedButton = this.handleProceedButton.bind(this);
    this.fecthNewMessagesForParticularChat = this.fecthNewMessagesForParticularChat.bind(this);
    this.submitMessage = this.submitMessage.bind(this)
    this.handleNewChat = this.handleNewChat.bind(this)
    this.refreshChatLists = this.refreshChatLists.bind(this)
  }

  componentDidMount() {
    this.setState({
      chatInterval: setInterval(this.refreshChatLists, 6000)
    })
  }

  refreshChatLists() {
    if (this.state.globalSettings.name) {
      const people = [];
      if (this.state.chats) {
        for (const element of this.state.chats) {
          people.push(element.name);
        }
      }

      axios.post(`${this.state.globalSettings.serverRoot}my-chats/refresh-chats`, {
        people: people,
        withCredentials: true
      }, {
          withCredentials: true
        }).then((response) => {
          const data = response.data;
          if (data.error) {
            console.error("Refresh chats error ->", data.error);
            this.setState({
              toast: "Error while refreshing chat lists",
              toastTime: Date.now(),
              toastDuration: 5000
            })
          } else {
            console.log(data)
            if (!data.empty && data) {
              var chats = this.state.chats;
              console.log("New conversation loaded")
              chats = chats.concat(data);
              this.setState({
                chats: chats,
                toast: "New conversation loaded",
                toastTime: Date.now(),
                toastDuration: 5000,
              })
            }
          }
        })
    }
  }

  /*
  Handleproceedbutton handles login and initial download of saved chats, also handles new accounts
  */
  handleProceedButton(name, password, newAccount) { // For login

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
          seti.name = response.data.name;
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
                  toast: "An error occurred while trying to load your chats\n, please try again.",
                  toastTime: Date.now(),
                  toastDuration: 5000,
                })
                console.error("Login", response.data.error)
                return;
              } else {
                const newState = this.state;
                newState.chats = response.data;
                newState.notDownloaded = false;
                this.setState(newState);
              }

            }).catch(function (error) {
              alert("An error occured while fetching your chats, please reload the app");
              console.error("Fetching chats", error);
            })

        }
      ).catch((error) => {
        console.error("OOPS", error)
        this.setState({
          toast: error,
          toastTime: Date.now(),
          toastDuration: 5000,
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
      }
    })
    this.setState({
      activeChatIndex: index
    })

  }
  fecthNewMessagesForParticularChat(name, chatId, date) {
    axios.post(`${this.state.globalSettings.serverRoot}my-chats/new-messages`, {
      withCredentials: true,
      date: date,
      chatId: chatId
    }, {
        withCredentials: true
      }).then((response) => {
        if (response.data.length > 0) {
          const newChats = this.state.chats;
          newChats[this.state.activeChatIndex].messages = newChats[this.state.activeChatIndex].messages.concat(response.data);
          this.setState({
            chats: newChats
          })
        }

      }).catch((error) => {
        this.setState({
          toast: "Error while fetching new chats.",
          toastTime: Date.now(),
          toastDuration: 5000,
        })
        console.error("Fetch new messages error - >", error);
      })
  }

  submitMessage(from, value, chatId) { // Submit a chat message 
    //from parameter sent is uselss.
    this.setState({
      toast: "Posting message",
      toastTime: Date.now(),
      toastDuration: 1000,
    });
    axios.post(`${this.state.globalSettings.serverRoot}my-chats/submit-message`, {
      from: this.state.globalSettings.name,
      message: value,
      chatId: chatId,
      withCredentials: true
    },
      {
        withCredentials: true
      }
    ).then((response) => {
      // ? 
    }).catch((error) => {
      console.error("POSTED new message", error)
      this.setState({
        toast: `Error posting message ${error}`,
        toastTime: Math.random(),
        toastDuration: 5000,
      })

    })
  }

  handleNewChat(data) {
    if (data.data.error) {
      console.error("New Chat Received error", data.data.error);
      this.setState({
        toast: "Failed to create a new conversation",
        toastTime: Math.random(),
        toastDuration: 5000,
      })
    } else {

      if (!data.data.empty) {
        const chats = this.state.chats;
        chats.unshift(data.data);
        this.setState({
          chats: chats
        })
      } else {
        this.setState({
          toast: "No matching account",
          toastTime: Math.random(),
          toastDuration: 5000,
        })
      }

    }
  }

  render() {
    if (!this.state.globalSettings.loggedIn) {
      return (
        <div>
          <div className="mobile">
            <h1>🙁 📱 🚫</h1>
            <p>We are sorry, but we currently dont support mobile devices Please use a desktop.</p>
          </div>
          <Loginform globalSettings={this.state.globalSettings} handleProceedButton={this.handleProceedButton} message={this.state.loginFormMessage}></Loginform>
        </div>
      )
    } else {
      var chats = [];
      for (var element of this.state.chats) {
        chats.push(
          <Chat name={element.name} onActivate={this.activate} globalSettings={this.state.globalSettings} active={(element.name === this.state.active)} key={element.name} />
        )
      }
      if (this.state.notDownloaded) {
        chats = <p className="no-chats text-center padding-10 color-white">
          <img className="loading" src={loading} alt="..." />
          Downloading conversations...</p>
      } else if (chats.length === 0) {
        chats = <p className="no-chats text-center padding-10 color-white">
          To begin, search the exact name of a person and start chatting!
                </p>
      }

      // List of already chatted people for SearchResults
      const people = [];
      for (element of this.state.chats) {
        people.push(element.name);
      }


      return (
        <div>
          <div className="chat-app container">
            <Toast message={this.state.toast} time={this.state.toastTime} toastDuration={this.state.toastDuration} ></Toast>
            <div className="row app-row">
              <div className="col-4 chats">
                <div className="chats-inner">
                  <SearchResults globalSettings={this.state.globalSettings} people={people} handleSearchResult={this.handleNewChat} />
                  <ul>
                    {chats}
                  </ul>
                </div>


              </div>
              <div className="col-8">
                <Chatbox name={this.state.active} globalSettings={this.state.globalSettings} chat={this.state.chats[this.state.activeChatIndex]} fetchNewMessagesForActiveChat={this.fecthNewMessagesForParticularChat} submitMessage={this.submitMessage}></Chatbox>
              </div>
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