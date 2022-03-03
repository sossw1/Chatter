const socket = io();

document.querySelector('#message-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const message = document.querySelector('#message').value;
  socket.emit('sendMessage', message, (error) => {
    if (error) {
      return console.log(error);
    }
    console.log('Message sent successfully');
  });
});

document.querySelector('#location-button').addEventListener('click', () => {
  navigator.geolocation.getCurrentPosition((position) => {
    const { latitude, longitude } = position.coords;
    const location = { latitude, longitude };
    socket.emit('sendLocation', location, () => {
      console.log('Location sent successfully');
    });
  });
})

socket.on('message', (message) => {
  console.log(message);
})

socket.on('sendMessage', (message) => {
  console.log(message);
})