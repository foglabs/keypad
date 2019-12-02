// may not need this
// import axios_lib from 'axios';
// const axios = axios_lib.create({
//   baseURL: BACKEND + ':4000',
// });
import React, { Component } from 'react';
import { w3cwebsocket as W3CWebSocket } from "websocket";

// 'ws://localhost:8000'
const BACKEND = 'ws://' + window.location.hostname + ':8000';
const client = new W3CWebSocket(BACKEND);

class App extends Component {
  constructor(props){
    super(props)
    this.onClick=this.onClick.bind(this);
    console.log('cool')
  }
  componentWillMount() {
    client.onopen = () => {
      console.log('WebSocket Client Connected');
    };
    client.onmessage = (message) => {
      console.log(message);
    };
  }

  onClick(){
    console.log('I fucking clicked stupid')
    if(client.readyState === client.OPEN){
      client.send('but for your ass stupid');
    }
  }
  
  render() {
    let keys =

    return (
      <button onClick={ () => this.onClick() }>
        suck it
      </button>
    );
  }
}

function Key (props){
  return (
    <div onClick={ props.onClick } >
      { props.number }
    </div>
  );
}

export default App;