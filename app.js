// APP
require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');
// const faker = require('faker');

const app = express();
const httpServer = http.createServer(app);
const io = new socketIO.Server(httpServer);

const PORT = process.env.PORT || 3000;

const gameRoute = require('./routes/game.route');

app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('index');
});
app.use('/game', gameRoute);

const rooms = io.of('/').adapter.rooms;
let rc = 0;
let rn = 'default';
const colors = ['red', 'orange', 'yellow', 'pop'];
const positions = [
  [5, 5],
  [5, 6],
  [6, 5],
  [6, 6],
];
const Hero = require('./core/hero.model');
const Game = require('./core/game.model');
const games = [];
const users = [];

io.on('connection', (socket) => {
  socket.hn = users.length;
  if (users.length === 0) {
    const game = new Game([]);
    games.push(game);
  }
  socket.gn = games.length - 1;
  users.push('hero');
  rn = rc === 0 ? socket.id : rn;
  console.log(`New connection: [${socket.id}](${io.engine.clientsCount})`);
  socket.leave(socket.id);
  socket.join(rn);
  const usersList = rooms.get(rn);
  // console.log(`${socket.id}:${colors[rc]}`);
  socket.emit('get:room', {
    users: [...usersList],
    room: rn,
    count: rc,
    color: colors[rc],
  });
  const heroData = {
    uid: socket.id,
    room: rn,
    position: positions[rc],
    color: colors[rc],
  };
  io.to(rn).emit('get:user', {
    user: `${heroData.color}--${heroData.uid}`,
  });
  const hero = new Hero(heroData);
  games[socket.gn].users.push(hero);
  if (users.length === 4) {
    io.to(rn).emit('get:game', {
      game: 'Game start!',
    });
  }
  socket.on('hero:move', (key) => {
    const data = {
      heroNum: socket.hn,
      key: key.key,
    };
    const position = games[socket.gn].users[socket.hn].heroMove(data.key);
    games[socket.gn].tableCheck(socket.hn);
    socket.emit('hero:move', { position });
  });
  io.to(rn).emit('game:table', {
    table: games[socket.gn].table,
  });
  io.emit('get:usersCount', { all: io.engine.clientsCount });
  if (rc === 3) {
    users.splice(0, users.length);
    rc = 0;
  } else {
    rc += 1;
  }
});

httpServer.listen(PORT, () => {
  console.log(`Server: ${PORT}`);
});
