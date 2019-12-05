const webSocketsServerPort = 8000;
const webSocketServer = require('websocket').server;
const http = require('http');

const MASTER_KEY = '123457'

// I'm maintaining all active connections in this object
const clients = {};
const client_modes = {}
const master = ''

// This code generates unique userid for everyuser.
const getUniqueID = () => {
  const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  return s4() + s4() + '-' + s4();
};

// Spinning the http server and the websocket server.
const server = http.createServer();
server.listen(webSocketsServerPort);

console.log('kickin that ass bro')
const wsServer = new webSocketServer({
  httpServer: server
});


// connect in the first place
wsServer.on('request', function(request) {

  // we doin this REGARDLESS
  var userID = getUniqueID();

  let origin = request.origin;
  console.log((new Date()) + ' Recieved a new connection from origin ' + origin + '.');
  // You can rewrite this part of the code to accept only the requests from allowed origin (if ya feel that)
  const connection = request.accept(null, origin);

  clients[userID] = connection;
  
  if(origin.endsWith('m')){
    // master
    
    // dont need to send id back.. for now
    master = userID;

  } else if(origin.endsWith('p')) {
  
    // player
    var modas = ['a','b','c','d','e','f'];    
    var mod = modas[Math.floor(Math.random()*modas.length)];
    client_modes[userID] = mod;

    let data = JSON.stringify({userid: userID, mode: mod});
    clients[userID].send(data);    
  }


  console.log('connected: ' + userID + ' in ' + Object.getOwnPropertyNames(clients))

  connection.on('message', function(message) {

    if (message.type === 'utf8') {
      console.log('Received Message: ' + message.utf8Data);
      console.log(message.utf8Data)

      let data = JSON.parse(message.utf8Data);
      console.log(data)

      let note = client_modes[data.userid] + data.note;

      // broadcast note to master connection
      if(clients[master]){
        clients[master].send(note);
      }
    }

    //     connection.sendUTF(message.utf8Data);
    // } else if (message.type === 'binary') {
    //     console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
    //     connection.sendBytes(message.binaryData);
  });
});
