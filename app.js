// APP
require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');

const app = express();
const httpServer = http.createServer(app);
const io = new socketIO.Server(httpServer);

const PORT = process.env.PORT || 3000;

app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('index');
});

const rooms = io.of('/').adapter.rooms;
let rc = 1; // 2 max & 1 min
let rn = 'default';

io.on('connection', (socket) => {
  rn = rc === 1 ? socket.id : rn;
  console.log(`New connection [${socket.id}](${io.engine.clientsCount})`);
  socket.leave(socket.id);
  socket.join(rn);
  const usersList = rooms.get(rn);
  io.to(rn).emit('get:users', {
    users: [...usersList],
    room: rn,
    count: rc,
  });
  io.emit('get:usersCount', { all: io.engine.clientsCount });
  rc === 2 ? (rc = 1) : (rc += 1);
});

httpServer.listen(PORT, () => {
  console.log(`Server: ${PORT}`);
});
