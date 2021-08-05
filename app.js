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
const colors = ['#e91e63', '#4caf50', '#ffc107', '#321e22'];
const cNames = ['red', 'green', 'yellow', 'pop'];

const Hero = require('./core/hero.model');
const Game = require('./core/game.model');
const games = [];
const users = [];

io.on('connection', (socket) => {
  const positions = [
    [5, 5],
    [5, 6],
    [6, 5],
    [6, 6],
  ];
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
    color: cNames[rc],
  });
  const heroData = {
    uid: socket.id,
    room: rn,
    num: socket.hn,
    position: positions[rc],
    color: colors[rc],
    cName: cNames[rc],
  };
  io.to(rn).emit('get:user', {
    user: `${heroData.color}--${heroData.uid}`,
  });
  const hero = new Hero(heroData);
  games[socket.gn].users.push(hero);
  games[socket.gn].addHero();
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
    const score = [0, 0, 0, 0];
    let empty = 0;
    games[socket.gn].table.forEach((row, i) => {
      row.forEach((col, j) => {
        if (games[socket.gn].table[i][j] !== null) {
          score[games[socket.gn].table[i][j]] += 1;
        } else {
          empty += 1;
        }
      });
    });
    const status = score.some((el) => el > 39);
    if (status || empty === 0) {
      const arrayMaxIndex = function (array) {
        return array.indexOf(Math.max.apply(null, array));
      };
      console.log(arrayMaxIndex(score));
      const winner = games[socket.gn].users[arrayMaxIndex(score)].cName;
      console.log(winner);
      io.to(rn).emit('game:end', { status: true, winner });
    } else {
      const position = games[socket.gn].tableCheck(data);
      const users = games[socket.gn].users.map((user) => user.position);
      const table = games[socket.gn].table;
      io.to(rn).emit('hero:move', { position, colors, table, users, cNames });
    }
  });

  io.to(rn).emit('game:table', {
    table: games[socket.gn].table,
    colors,
    users: games[socket.gn].users.map((user) => user.position),
  });
  io.emit('get:usersCount', { all: io.engine.clientsCount });
  if (rc === 3) {
    users.splice(0, users.length);
    rc = 0;
  } else {
    rc += 1;
  }
  socket.on('mail:message', (message) => {
    message.text = `${cNames[socket.hn]}: ${message.text}`;
    io.to(rn).emit('mail:message', message);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server: ${PORT}`);
});
