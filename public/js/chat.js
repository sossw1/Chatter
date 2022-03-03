const socket = io();

const $message = document.querySelector('#message');
const $messageForm = document.querySelector('#message-form');
const $locationButton = document.querySelector('#location-button');

$messageForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const message = $message.value;
  socket.emit('sendMessage', message, (error) => {
    if (error) {
      return console.log(error);
    }
    console.log('Message sent successfully');
  });
});

$locationButton.addEventListener('click', () => {
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