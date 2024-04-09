
const socket = io();
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');

function sendMessage(message) {
    socket.emit('chat-message', message);
}

socket.on('chat-message', (data) => {
    const { username, message } = data;
    const messageElement = document.createElement('div');
    messageElement.classList.add('chat-message');
    messageElement.innerHTML = `<strong>${username}:</strong> ${message}`;
    chatMessages.appendChild(messageElement);
});

chatInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        const message = chatInput.value;
        sendMessage(message);
        chatInput.value = '';
    }
});
