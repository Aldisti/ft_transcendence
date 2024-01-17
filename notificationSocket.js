const http = require('http');
const WebSocket = require('ws');

const server = http.createServer();
const wss = new WebSocket.Server({ server });

function padZero(num) {
    return num.toString().padStart(2, '0');
  }

function getCurrentTimestampString() {
    const currentDate = new Date();
  
    const year = currentDate.getFullYear();
    const month = padZero(currentDate.getMonth() + 1); // Months are zero-indexed
    const day = padZero(currentDate.getDate());
    const hours = padZero(currentDate.getHours());
    const minutes = padZero(currentDate.getMinutes());
    const seconds = padZero(currentDate.getSeconds());
  
    return `${year}/${month}/${day}:${hours}.${minutes}.${seconds}`;
  }
  let toSend = {
    type: "private",
    sender: "gpanico",
    body: "ciao a te ciao a te ciao a te ciao a te ciao a te ciao a te ciao a te ciao a te ciao a te ciao a te ciao a te ciao a te ciao a te ciao a te ciao a te ciao a te ciao a te ciao a te ciao a te ciao a te ciao a te ciao a te ",
    time_sent: getCurrentTimestampString()
}
  let global = {
    type: "global",
    sender: "adi-stef",
    body: "ciao a te",
    time_sent: getCurrentTimestampString()
}
  let global1 = {
    type: "global",
    sender: "testw",
    body: "ciao a te",
    time_sent: getCurrentTimestampString()
}
  let global2 = {
    type: "global",
    sender: "luigi",
    body: "ciao a te",
    time_sent: getCurrentTimestampString()
}
  let global3 = {
    type: "global",
    sender: "mario",
    body: "ciao a te",
    time_sent: getCurrentTimestampString()
}
let arr = [global, global1, global2, global3,]


wss.on('connection', (ws) => {
    setInterval(() => {
        console.log(Math.floor(Math.random() * 10))
        toSend.time_sent = getCurrentTimestampString();
        global.time_sent = getCurrentTimestampString();
        if (Math.floor(Math.random() * 10) % 2 == 0)
            ws.send(JSON.stringify(toSend));
        else
            ws.send(JSON.stringify(arr[Math.floor(Math.random() * 10)]));
    }, 1000);
  console.log('A user connected');

  ws.on('message', (message) => {
    console.log('Received message:', message);
    
  });

  ws.on('close', () => {
    console.log('User disconnected');
  });
});

const PORT = process.env.PORT || 9000;
server.listen(PORT, () => {
  console.log(`WebSocket server listening on port ${PORT}`);
});
