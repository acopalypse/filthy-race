// eslint-disable-next-line no-undef
const socket = io();

const chatArea = document.getElementById('chatArea');
const title = document.getElementById('title');
const color = document.getElementById('color');
const game = document.getElementById('game');

Array(12)
  .fill('')
  .forEach((_, i) => {
    Array(12)
      .fill('')
      .forEach((_, j) => {
        const div = document.createElement('div');
        div.dataset.coord = `${i}:${j}`;
        div.className = 'place';
        game.append(div);
      });
  });

socket.on('connect', () => {
  chatArea.innerHTML = '';
});

socket.once('get:room', (data) => {
  data.users.pop();
  title.innerText = `Session: ${data.room}`;
  data.users.forEach((user) => {
    const p = document.createElement('p');
    p.innerText = `connect: ${user}`;
    chatArea.append(p);
  });
  color.innerHTML = `${data.color}`;
});

socket.on('get:user', (data) => {
  const p = document.createElement('p');
  p.innerText = `connect: ${data.user}`;
  chatArea.append(p);
});

socket.on('get:game', (data) => {
  const { game } = data;
  const p = document.createElement('p');
  p.innerText = game;
  chatArea.append(p);

  window.addEventListener('keydown', (e) => {
    if (
      e.key === 'ArrowLeft' ||
      e.key === 'ArrowRight' ||
      e.key === 'ArrowDown' ||
      e.key === 'ArrowUp'
    ) {
      socket.emit('hero:move', { key: e.key });
    }
  });
});

socket.on('game:table', (data) => {
  const { table, colors, users } = data;
  table.forEach((col, y) =>
    col.forEach((row, x) => {
      const el = document.querySelector(`[data-coord='${x}:${y}']`);
      if (el !== null) {
        el.style = `background-color: ${colors[table[x][y]]}`;
      }
      el.innerHTML = '';
    }),
  );
  users.forEach((user, i) => {
    const [X, Y] = user;
    const el = document.querySelector(`[data-coord='${X}:${Y}']`);
    el.innerHTML = `<img src="/images/image_${i}.png">`;
  });
});

socket.on('hero:move', (data) => {
  const { colors, table, users, cNames } = data;
  const count = [0, 0, 0, 0];
  const [X, Y] = data.position;
  table.forEach((col, y) =>
    col.forEach((row, x) => {
      table[x][y] !== null ? (count[table[x][y]] += 1) : '';
      const el = document.querySelector(`[data-coord='${x}:${y}']`);
      el.style = `background-color: ${colors[table[x][y]]}`;
      el.innerHTML = '';
    }),
  );
  count.forEach((score, i) => {
    const span = document.getElementById(`score_${i}`);
    span.innerHTML = score;
  });
  users.forEach((user, i) => {
    const [X, Y] = user;
    const el = document.querySelector(`[data-coord='${X}:${Y}']`);
    el.innerHTML = `<img src="/images/image_${i}.png">`;
  });
});
