const socket = io();

const $message = document.querySelector('#message');
const $messageForm = document.querySelector('#message-form');
const $locationButton = document.querySelector('#send-location');
const $messages = document.querySelector('#messages');
const $sidebar = document.querySelector('#sidebar');

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML;
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;

// Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true });

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

const autoScrollOnBottom = () => {
  const $newMessage = $messages.lastElementChild;
  const newMessageStyles = getComputedStyle($newMessage);
  const newMessageMargin = parseInt(newMessageStyles.marginBottom);
  const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;
  const visibleHeight = $messages.offsetHeight;
  const containerHeight = $messages.scrollHeight;
  const scrollOffset = $messages.scrollTop + visibleHeight;
  if (containerHeight - newMessageHeight <= scrollOffset) {
    $messages.scrollTop = $messages.scrollHeight;
  }
}

socket.on('message', (message) => {
  if (message.text !== '') {
    const html = Mustache.render(messageTemplate, {
      username: message.username,
      message: message.text,
      createdAt: moment(message.createdAt).format('h:mm A')
    });
    $messages.insertAdjacentHTML('beforeend', html);
    autoScrollOnBottom();
  }
})

socket.on('locationMessage', (location) => {
  const html = Mustache.render(locationMessageTemplate, {
    username: location.username,
    url: location.url,
    createdAt: moment(location.createdAt).format('h:mm A')
  });
  $messages.insertAdjacentHTML('beforeend', html);
});

socket.on('roomData', ({ room, users }) => {
  const html = Mustache.render(sidebarTemplate, {
    room,
    users
  })
  $sidebar.innerHTML = html;
})

socket.emit('join', { username, room }, (error) => {
  if (error) {
    alert(error);
    location.href = '/';
  }
});