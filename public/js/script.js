// eslint-disable-next-line no-undef
const socket = io();

const usersList = document.getElementById('usersList');
const roomName = document.getElementById('roomName');
const allUsers = document.getElementById('allUsers');

socket.on('get:users', (data) => {
  roomName.innerText = data.room;
  usersList.innerHTML = '';
  data.users.forEach((user) => {
    const p = document.createElement('p');
    p.innerText = user;
    usersList.append(p);
  });
});
socket.on('get:usersCount', (data) => {
  allUsers.innerText = data.all;
});
