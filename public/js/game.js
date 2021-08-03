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

socket.on('hero:move', (data) => {
  const { position } = data;
  const tableEl = document.querySelector(
    `[data-coord='${position[0]}:${position[1]}']`,
  );
  tableEl.style = 'background-color: red';
});
