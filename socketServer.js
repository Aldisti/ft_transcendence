const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 3000 });

server.on('connection', (socket) => {
  console.log('Client connected');

  let x = 0;
  let direction = 1; // 1 for moving right, -1 for moving left

  // Update coordinates every second
  const interval = setInterval(() => {
    x += direction * 5; // Adjust the step size as needed

    // If the point reaches the right or left boundary, change direction
    if (x >= 800 || x <= 0) {
      direction *= -1;
    }

    const coordinates = {
      x: x,
      y: 100
    };

    // Convert the coordinates to JSON and send to the connected client
    socket.send(JSON.stringify(coordinates));
  }, 10);

  // Listen for messages from the client (optional)
  socket.on('message', (message) => {
    console.log(`Received message: ${message}`);
  });

  // Handle socket closure
  socket.on('close', () => {
    console.log('Client disconnected');
    clearInterval(interval); // Stop sending coordinates when the client disconnects
  });
});

console.log('WebSocket server running on ws://localhost:3000');
