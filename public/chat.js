// Make connection
const socket = io.connect('http://localhost:4000');

const $ = selector => document.querySelector(selector);

// Query DOM
const $message = $('#message'),
    $handle = $('#handle'),
    $btn = $('#send'),
    $output = $('#output'),
    $feedback = $('#feedback');

// Emit events
$btn.addEventListener('click', () => {
    socket.emit('chat', {
        message: $message.value,
        handle: $handle.value
    });
});

$message.addEventListener('keypress', () => {
    socket.emit('typing', $handle.value);
});

// Listen for events
socket.on('chat', (data) => {
    $feedback.innerHTML = '';
    if(data.handle === $handle.value){
        $output.innerHTML += `<p id="own-message"><strong>${data.handle}: </strong>${data.message}</p>`;
    }else{
        $output.innerHTML += `<p><strong>${data.handle}: </strong>${data.message}</p>`;
    }
    $message.value = '';
    $message.focus();
});

socket.on('typing', (data) => {
    $feedback.innerHTML = `<p><em>${data} is typing...</em></p>`;
});