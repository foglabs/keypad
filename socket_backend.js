const webSocketsServerPort = 8000;
const webSocketServer = require('websocket').server;
const http = require('http');

const MASTER_KEY = '123457'

// I'm maintaining all active connections in this object
const clients = {};
const client_modes = {}
const client_ready = {}

let master = ''

// This code generates unique userid for everyuser.
const getUniqueID = () => {
  const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  return s4() + s4() + '-' + s4();
};

const note = function(int){
  int = int % 24
  switch(int){
    case 0: return 'C1';
    case 1: return 'Cs1';
    case 2: return 'D1';
    case 3: return 'Ds1';
    case 4: return 'E1';
    case 5: return 'F1';
    case 6: return 'Fs1';
    case 7: return 'G1';
    case 8: return 'Gs1';
    case 9: return 'A1';
    case 10: return 'As1';
    case 11: return 'B1';
    case 12: return 'C2';
    case 13: return 'Cs2';
    case 14: return 'D2';
    case 15: return 'Ds2';
    case 16: return 'E2';
    case 17: return 'F2';
    case 18: return 'Fs2';
    case 19: return 'G2';
    case 20: return 'Gs2';
    case 21: return 'A2';
    case 22: return 'As2';
    case 23: return 'B2';
  }
}

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

  console.log('connected: ' + userID + ' in ' + Object.getOwnPropertyNames(clients))

  connection.on('message', function(message) {

    if (message.type === 'utf8') {
      console.log('Received Message: ' + message.utf8Data);
      console.log(message.utf8Data)

      let data = JSON.parse(message.utf8Data);
      console.log(data)

      // get origin from client!
      if(!client_ready[userID]) {

        if(data.url.endsWith('m')){
        // if(origin.endsWith('3001')){
          // master
          
          // dont need to send id back.. for now
          console.log('Master Was Set ' + userID)
          master = userID;

        // } else if(origin.endsWith('3000')) {
        } else {
          // player
          var modas = ['a','b','c','d','e','f'];    
          var mod = modas[Math.floor(Math.random()*modas.length)];
          client_modes[userID] = mod;

          let data = JSON.stringify({userid: userID, mode: mod});
          clients[userID].send(data);
        }

        client_ready[userID] = true;

      } else {
        // get the mode, get the note - boom
        let note_name = client_modes[data.userid] + data.note;

        // broadcast note to master connection
        if(clients[master]){
          console.log('found master ' + master)
          clients[master].send(note_name);
        }

      }
      
    }
  });
});
