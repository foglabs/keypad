const BACKEND = 'ws://' + window.location.hostname + ':8000';

// may not need this
// import axios_lib from 'axios';
// const axios = axios_lib.create({
//   baseURL: BACKEND + ':4000',
// });

import React, { Component } from 'react';
import { w3cwebsocket as W3CWebSocket } from "websocket";

// 'ws://localhost:8000'
const client = new W3CWebSocket(BACKEND);

class App extends Component {
  componentWillMount() {
    client.onopen = () => {
      console.log('WebSocket Client Connected');
    };
    client.onmessage = (message) => {
      console.log(message);
    };
  }
  
  render() {
    return (
      <div>
        Practical Intro To WebSockets.
      </div>
    );
  }
}

export default App;