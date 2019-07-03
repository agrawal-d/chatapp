import React from 'react';
import './bootstrap-grid.css';
import './App.css';
import loading from './loading.gif'
const axios = require('axios');


class Loginform extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: ""
    }
    this.handleProceedButton = this.handleProceedButton.bind(this)
  }
  handleProceedButton() {
    this.props.handleProceedButton("username", "password");
    // @todo fix above
  }
  render() {
    return (
      <div className="chat-app container login">
        <h1 className="login-text">Welcome to Chat</h1>
        <p className="login-subtext">Login or Create an Account to start chatting.<br /> Enter your username and password or create new ones, and an account will be created for you.</p>
        <input className="login-field theme-input" placeholder="Full Name" maxLength="64" />
        <input className="login-field theme-input" type="password" placeholder="Password" maxLength="128" />
        <br />
        <button className="theme-btn login-field" onClick={this.handleProceedButton}>Proceed</button>
        <br />
        <p className="message">{this.props.message}</p>
        <small>&copy; 2019 Diyanshu Agrawal. All rights reserved.</small>
      </div >

    )
  }
}

const globalChats = [
  {
    name: "Akul Singhal",
    messages: [
      {
        text: "Hello Divyanshu",
        from: "Akul Singhal",
        id: "csefvwvrvwe"
      }, {
        text: "Hi Akul",
        from: "Divyanshu Agrawal",
        id: "Dcswfcwefcwe"
      },
      {
        text: "Hello Divyanshu",
        from: "Akul Singhal",
        id: "csefvlwvrvwe"
      }, {
        text: "Hi Akul",
        from: "Divyanshu Agrawal",
        id: "Dcswllfcwefcwe"
      },
      {
        text: "Hello Divyanshu",
        from: "Akul Singhal",
        id: "csehfvwvrvwe"
      }, {
        text: "Hi Akul",
        from: "Divyanshu Agrawal",
        id: "Dcuhbswfcwefcwe"
      },
      {
        text: "Hello Divyanshu",
        from: "Akul Singhal",
        id: "csefvuiygvwvrvwe"
      }, {
        text: "Hi Akul",
        from: "Divyanshu Agrawal",
        id: "Dcswbouyfcwefcwe"
      },
      {
        text: "Hello Divyanshu",
        from: "Akul Singhal",
        id: "csefiupvwvrvwe"
      }, {
        text: "Hi Akul",
        from: "Divyanshu Agrawal",
        id: "Dcswp,ofcwefcwe"
      },
      {
        text: "Hello Divyanshu",
        from: "Akul Singhal",
        id: "csefvp,owvrvwe"
      }, {
        text: "Hi Akul",
        from: "Divyanshu Agrawal",
        id: "Dcswvufcwefcwe"
      },
      {
        text: "Hello Divyanshu",
        from: "Akul Singhal",
        id: "cseftucvwvrvwe"
      }, {
        text: "Hi Akul",
        from: "Divyanshu Agrawal",
        id: "Dczewswfcwefcwe"
      },
      {
        text: "Hello Divyanshu",
        from: "Akul Singhal",
        id: "csefjghvwvrvwe"
      }, {
        text: "Hi Akul",
        from: "Divyanshu Agrawal",
        id: "Dcsioywfcwefcwe"
      },
    ]
  }, {
    name: "Ashutosh Agrawal",
    messages: [
      {
        text: "Hello Divyanshu",
        from: "Ashutosh Agrawal",
        id: "aweqfcwefcw"
      }, {
        text: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.",
        from: "Divyanshu Agrawal",
        id: "asdcsdacwfea"
      }, {
        text: "But of course , that is correct. 🙂🙂 .Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc. ",
        from: "Ashutosh Agrawal",
        id: "aweqfcwefcwkk"
      }, {
        text: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum",
        from: "Divyanshu Agrawal",
        id: "aweqfcwefcw0"
      }, {
        text: "Bye",
        from: "Ashutosh Agrawal",
        id: "aweqfcwefcw,"
      },
    ]
  }, {
    name: "Aditi Pathak",
    messages: []
  }
];

class Chatbox extends React.Component {

  render() {
    if (globalChats.find(obj => {
      return obj.name === this.props.chat;
    })) {
      // Found stored chat in vars
      const chatbubbles = [];
      var chatIndex = null;
      for (var index in globalChats) {
        if (globalChats[index].name === this.props.chat) {
          chatIndex = index;
        }
      }
      for (const message of globalChats[chatIndex].messages) {
        const bubbleClassName = "chat-bubble " + (message.from === this.props.globalSettings.name ? "sent" : "received");
        chatbubbles.push(
          <div className={bubbleClassName} key={message.id}>
            <div className="chat-bubble-info">
              {message.from}
            </div>
            <div className="chat-bubble-message">
              {message.text}
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
    } else if (!this.props.chat) {
      // Chat is null
      return (
        <p className="no-chat-selected">Select a name on the side to begin chatting.</p>
      )
    } else {
      //Chat exists but not downloaded.
      return (
        <p className="no-chat-selected">Downloading messages.</p>
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
      active: null,
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

  handleProceedButton(username, password) {
    this.setState({
      loginFormMessage: (
        <span>
          <img src={loading} className="loading" alt="..." />
          <span>Please wait, attempting to log you in...  </span>
        </span>
      )
    })
    console.log(this.state.globalSettings.serverRoot)
    axios.post(this.state.globalSettings.serverRoot + "login", {
      username: null,
      password: null,
      withCredentials: true,
    }, {
        withCredentials: true
      }).then(
        (response) => {
          const seti = this.state.globalSettings;
          seti.loggedIn = true;
          this.setState({
            globalSettings: seti,
          })

          axios.get(`${this.state.globalSettings.serverRoot}my-chats`, {}, {
            withCredentials: true
          }).then((response) => {
            const newState = this.state;
            newState.chats = response.data;
            this.setState(newState);
            console.log("Loaded Chats : ", response.data)
          }).catch(function (error) {
            alert("An error occured while fetching your chats, please reload the app");
            console.error("Fetching chats", error);
          })

        }
      ).catch(function (error) {
        console.error("OOPS", error)
      }).finally(() => {
        return axios.get(this.state.globalSettings.serverRoot, {
          withCredentials: true
        }, {
            withCredentials: true
          })
      }).then(function (response) {
        console.log("CHECK", response)
      })


  }


  activate(name) {
    this.setState({
      active: name
    })
  }

  render() {
    if (!this.state.globalSettings.loggedIn) {
      return (
        <Loginform globalSettings={this.state.globalSettings} handleProceedButton={this.handleProceedButton} message={this.state.loginFormMessage}></Loginform>
      )
    } else {
      const chats = [];
      for (var element of this.state.chats) {
        chats.push(
          <Chat name={element.name} onActivate={this.activate} globalSettings={this.state.globalSettings} active={(element.name === this.state.active)} key={element.name} />
        )
      }
      if (chats.length === 0) {
        chats.push(<p className="no-chats text-center padding-10 color-white">
          <img className="loading" src={loading} alt="..." />
          Downloading conversations...</p>)
        console.error('OOF')
      } else {
        console.log(chats);
      }

      return (
        <div className="chat-app container">
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
              <Chatbox chat={this.state.active} globalSettings={this.state.globalSettings}></Chatbox>
            </div>
          </div>


        </div>)
    }
  }
}

var friends = [
  "Akul", "Harshit", "Aditi"
]

function App() {
  return (
    <ChatApp />
  );
}

export default App;
