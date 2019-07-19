// Author Divyanshu Agrawal
// (C) 2019 - Present , All rights reserved.

import React from 'react';
import config from './config.js'
import io from 'socket.io-client';
import loading from './loading.gif'
import Toast from './components/Toast';
import Loginform from './components/LoginForm';
import Chatbox from './components/ChatBox';
import SearchResults from './components/SearchResults';
import Chat from './components/Chat';
import './css/bootstrap-grid.css';
import './css/roboto.css';
import './css/App.css';
const axios = require('axios');

class ChatApp extends React.Component {

  constructor(props) {
    super(props);
    this.activate = this.activate.bind(this);
    this.state = {
      chatInterval: null,
      notDownloaded: true,
      toast: null,
      toastTime: Date.now(),
      toastDuration: 5000,
      active: null,
      activeChatIndex: -1,
      globalSettings: config.globalSettings,
      chats: [
      ]
    }
    this.handleProceedButton = this.handleProceedButton.bind(this);
    this.fecthNewMessagesForParticularChat = this.fecthNewMessagesForParticularChat.bind(this);
    this.submitMessage = this.submitMessage.bind(this)
    this.handleNewChat = this.handleNewChat.bind(this)
    this.refreshChatLists = this.refreshChatLists.bind(this)
    this.setupSockets = this.setupSockets.bind(this)
    this.createInitialChatRefreshInterval = this.createInitialChatRefreshInterval.bind(this);
    this.handleToast = this.handleToast.bind(this)
  }

  createInitialChatRefreshInterval() {
    console.log("Initial Chat Lists Interval Set for 6000 seconds");
    this.setState({
      chatInterval: setInterval(this.refreshChatLists, 6000),
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
            if (!data.empty && data) {
              var chats = this.state.chats;
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

  setupSockets() {
    var socket = io(this.state.globalSettings.serverRoot);
    socket.on('test', function (msg) {
      console.log("Test Socket message  : ", msg);
    });
    this.setState({
      socket: socket
    })
    socket.on("new-message", (data) => {
      console.log("Message from server  :", data);
      const chats = this.state.chats;
      const activeChatIndex = this.state.activeChatIndex;
      chats[activeChatIndex].messages.push(data);
      this.setState({
        chats: chats
      })
    })
  }

  handleProceedButton(name, password, newAccount) {
    // Handleproceedbutton handles login and initial download of saved chats, also handles new accounts
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
          this.setupSockets();
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
                setTimeout(this.createInitialChatRefreshInterval, 6000);
              }
            }).catch(function (error) {
              alert("An error occured while fetching your chats, please reload the app");
              console.error("Fetching chats", error);
            })
        }
      ).catch((error) => {
        console.error("OOPS", error)
        this.setState({
          toast: error.toString(),
          toastTime: Date.now(),
          toastDuration: 5000,
        })
      })
  }

  activate(name) {
    if (this.state.activeChatIndex >= 0) {
      var oldActiveIndex = this.state.activeChatIndex;
      console.log("Leaveing room", this.state.chats[oldActiveIndex].id);
      this.state.socket.emit('leave-room', this.state.chats[oldActiveIndex].id);
    }
    this.setState({
      active: name
    })
    var index = -1;
    this.state.chats.find(function (item, i) {
      if (item.name === name) {
        index = i;
        return i;
      }
    })
    console.log("Chat switched");
    this.setState({
      activeChatIndex: index
    })
    console.log("Loading new messages for selected  chat", this.state.chats[index].id, this.state.chats[index].messages[this.state.chats[index].messages.length - 1].date);
    this.fecthNewMessagesForParticularChat(null, this.state.chats[index].id, this.state.chats[index].messages[this.state.chats[index].messages.length - 1].date)
    console.log("Joining room", this.state.chats[index].id);
    this.state.socket.emit('join-room', this.state.chats[index].id);
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

  submitMessage(to, value, chatId) {
    // Submit a chat message  withing a conversation
    //from parameter sent is uselss.
    this.setState({
      toast: "Posting message",
      toastTime: Date.now(),
      toastDuration: 1000,
    });
    const socket = this.state.socket;
    socket.emit("new-message", {
      message: value,
      chatId: chatId,
      from: this.state.globalSettings.name
    })
  }

  handleToast(toast, toastDuration) {
    this.setState({
      toast: toast,
      toastTime: Date.now(),
      toastDuration: toastDuration
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
        this.setState({
          toast: "Success : New Conversation will download in 6 seconds ... ",
          toastTime: Date.now(),
          toastDuration: 10000,
        })
      } else {
        this.setState({
          toast: "No matching account for your query",
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
          <Toast message={this.state.toast} time={this.state.toastTime} toastDuration={this.state.toastDuration} ></Toast>
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
      var chatId = null;
      if (this.state.chats[this.state.activeChatIndex]) {
        chatId = this.state.chats[this.state.activeChatIndex].id;
      }
      return (
        <div>
          <div className="chat-app container">
            <Toast message={this.state.toast} time={this.state.toastTime} toastDuration={this.state.toastDuration} ></Toast>
            <div className="row app-row">
              <div className="col-4 chats">
                <div className="chats-inner">
                  <SearchResults globalSettings={this.state.globalSettings} people={people} handleSearchResult={this.handleNewChat} handleToast={this.handleToast} />
                  <ul>
                    {chats}
                  </ul>
                </div>
              </div>
              <div className="col-8 chatbox-container">
                <Chatbox name={this.state.active} globalSettings={this.state.globalSettings} chat={this.state.chats[this.state.activeChatIndex]} submitMessage={this.submitMessage} socket={this.state.socket} chatId={chatId}></Chatbox>
              </div>
            </div>
          </div>
        </div>)
    }
  }
}

export default ChatApp;