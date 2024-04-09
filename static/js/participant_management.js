// participant_management.js

const socket = io();
const participantsList = document.getElementById('participantsList');
const muteButtons = document.getElementsByClassName('muteButton');
const kickButtons = document.getElementsByClassName('kickButton');

function muteParticipant(participantId) {
    socket.emit('mute-participant', participantId);
}

function kickParticipant(participantId) {
    socket.emit('kick-participant', participantId);
}

socket.on('update-participants', (participants) => {
    participantsList.innerHTML = '';
    participants.forEach((participant) => {
        const participantElement = document.createElement('div');
        participantElement.classList.add('participant');
        participantElement.innerHTML = `<strong>${participant.username}</strong> - ${participant.status}`;
        participantsList.appendChild(participantElement);
    });
});

Array.from(muteButtons).forEach((button) => {
    button.addEventListener('click', () => {
        const participantId = button.dataset.participantId;
        muteParticipant(participantId);
    });
});

Array.from(kickButtons).forEach((button) => {
    button.addEventListener('click', () => {
        const participantId = button.dataset.participantId;
        kickParticipant(participantId);
    });
});
