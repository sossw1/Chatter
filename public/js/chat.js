const socket = io();

const $message = document.querySelector('#message');
const $messageForm = document.querySelector('#message-form');
const $locationButton = document.querySelector('#location-button');
const $messages = document.querySelector('#messages');

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML;

$messageForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const message = $message.value;
  $message.value = '';
  $message.focus();
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
  const html = Mustache.render(messageTemplate, {
    message: message.text,
    createdAt: message.createdAt
  });
  $messages.insertAdjacentHTML('beforeend', html);
})

socket.on('locationMessage', (link) => {
  console.log(link);
  const html = Mustache.render(locationMessageTemplate, {
    link
  });
  $messages.insertAdjacentHTML('beforeend', html);
});