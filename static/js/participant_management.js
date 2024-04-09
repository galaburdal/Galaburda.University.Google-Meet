
var socket = io.connect('http://' + document.domain + ':' + location.port);

socket.on('participants_updated', function(data) {
    var participants = document.getElementById('participants');
    participants.innerHTML = '';
    data.forEach(function(participant) {
        var p = document.createElement('div');
        p.textContent = participant;
        participants.appendChild(p);
    });
});

document.getElementById('join').addEventListener('click', function() {
    var participant_id = document.getElementById('participant').value;
    socket.emit('join', {id: participant_id});
});

document.getElementById('leave').addEventListener('click', function() {
    var participant_id = document.getElementById('participant').value;
    socket.emit('leave', {id: participant_id});
});


const socket = io();
const localVideo = document.getElementById('localVideo');
const remoteVideos = document.getElementById('remoteVideos');
let localStream;
let peerConnections = {};

navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then((stream) => {
        localStream = stream;
        localVideo.srcObject = stream;
        socket.emit('join', { streamId: socket.id });
    })
    .catch((error) => {
        console.error('Error getting user media:', error);
    });


