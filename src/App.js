// may not need this
// import axios_lib from 'axios';
// const axios = axios_lib.create({
//   baseURL: BACKEND + ':4000',
// });
import React, { Component } from 'react';
import { w3cwebsocket as W3CWebSocket } from "websocket";

// 'ws://localhost:8000'
const URL = window.location.href;
// not actually used here, just for symmetry with -master
const BACKEND = window.location.host;
const SOCKET_BACKEND = 'ws://' + window.location.hostname + ':8000';
const client = new W3CWebSocket(SOCKET_BACKEND);

// var killCookie = function() {
//   document.cookie.split(";").forEach(function(c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });
// }

// // cookie thang
// var getCookie = function(name){
//   let key = name + '=';
//   let all = document.cookie.length > 0 ? document.cookie.split(';') : null;
//   let val = all ? all[0].split(key) : null;
//   if(val && val.length > 1){
//     return val[1];
//   }
// }

// var setCookie = function(name){
//   let fuck = 'id=' + name + '; expires=Thu, 2 Aug 3001 20:47:11 UTC; path=/'
//   console.log(fuck)
//   document.cookie = fuck;
// }

class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      userid: null,
    }

    this.playNote=this.playNote.bind(this);
    console.log('cool')
  }

  componentWillMount() {
    client.onopen = () => {
      console.log('WebSocket Client Connectedzz');
      let data = JSON.stringify({url: URL});
      client.send(data);
    };

    client.onmessage = (message) => {
      console.log('da message');
      console.log(message.data);
      let data = JSON.parse(message.data)
      this.setState({userid: data.userid});
    };
  }

  playNote(note){
    console.log('I fucking clicked stupid')
    if(client.readyState === client.OPEN){
      let userid = this.state.userid
      let data = JSON.stringify({userid: userid, note: note});
      client.send(data);
    }
  }
  
  render() {
    let keys = [0,1,2,3,4,5,6,7,8];
    return (
      <div>
        { keys.map((key) => <Key key={ key } number={ key } onClick={ () => this.playNote(key) } /> ) }
      </div>
    );
  }
}

function Key (props){
  return (
    <div className="key" onClick={ props.onClick } >
      <div className="number">
        { props.number + 1 }
      </div>
    </div>
  );
}

export default App;