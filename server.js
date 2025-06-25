const express = require('express');
const next = require('next');
const { createServer } = require('http');
const { Server } = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  const httpServer = createServer(server);
  const io = new Server(httpServer);

  io.on('connection', (socket) => {
    console.log('✅ Socket connected');

    socket.on('message:send', (message) => {
      socket.broadcast.emit('message:new', message);
    });
  });

  server.use((req, res) => {
    return handle(req, res);
  });

  httpServer.listen(3000, () => {
    console.log('🚀 Server running on http://localhost:3000');
  });
});
