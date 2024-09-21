// Make connection
const socket = io.connect('http://localhost:4000');

const $ = selector => document.querySelector(selector);

// Query DOM
const $message = $('#message'),
    $handle = $('#handle'),
    $btn = $('#send'),
    $output = $('#output'),
    $feedback = $('#feedback'),
    $userStatus = $('#user-status');

// Emit events
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        socket.emit('userStatus', { handle: $handle.value, status: 'online' });
    } else {
        socket.emit('userStatus', { handle: $handle.value, status: 'offline' });
    }
});



$btn.addEventListener('click', () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const currentTime = `${hours}:${minutes < 10 ? '0' + minutes : minutes}`;

    socket.emit('chat', {
        message: $message.value,
        handle: $handle.value,
        time: currentTime
    });
    scrollToBottom();
});

$message.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const currentTime = `${hours}:${minutes < 10 ? '0' + minutes : minutes}`;

        socket.emit('chat', {
            message: $message.value,
            handle: $handle.value,
            time: currentTime
        });
        $message.value = '';
    }
});


$message.addEventListener('keypress', () => {
    socket.emit('typing', $handle.value);
});

// Listen for events
socket.on('chat', (data) => {
    $feedback.innerHTML = '';
    if(data.handle === $handle.value){
        $output.innerHTML += `<p id="own-message"><strong>${data.handle}: </strong>${data.message} <span>${data.time}</span></p>`;
    }else{
        $output.innerHTML += `<p><strong>${data.handle}: </strong>${data.message} <span>${data.time}</span></p>`;
    }
    $message.value = '';
    $message.focus();
    scrollToBottom();
});

socket.on('typing', (data) => {
    $feedback.innerHTML = `<p><em>${data} is typing...</em></p>`;
});

socket.on('userStatus', (data) => {
    $userStatus.innerHTML = ''; 
    if(data.handle !== $handle.value) {
        const statusMessage = document.createElement('p');
        statusMessage.classList.add('user-status');
        statusMessage.innerHTML = `<strong>${data.handle}</strong> is ${data.status}`;
        $userStatus.appendChild(statusMessage);
    }    
});

function scrollToBottom() {
    const chatWindow = document.getElementById('chat-window');
    chatWindow.scrollTop = chatWindow.scrollHeight;
}