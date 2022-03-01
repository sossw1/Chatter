const socket = io();

document.querySelector('#message-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const message = document.querySelector('#message').value;
  socket.emit('sendMessage', message);
});

socket.on('sendMessage', (message) => {
  console.log(message);
})