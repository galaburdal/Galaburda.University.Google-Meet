
const socket = io();
const localVideo = document.getElementById('localVideo');
const remoteVideos = document.getElementById('remoteVideos');
let localStream;
let screenStream;
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

function startScreenSharing() {
    navigator.mediaDevices.getDisplayMedia({ video: true })
        .then((stream) => {
            screenStream = stream;
            localVideo.srcObject = screenStream;
            socket.emit('start-screen-share', { streamId: socket.id });
        })
        .catch((error) => {
            console.error('Error starting screen sharing:', error);
        });
}

function stopScreenSharing() {
    screenStream.getTracks().forEach((track) => {
        track.stop();
    });
    localVideo.srcObject = localStream;
    socket.emit('stop-screen-share', { streamId: socket.id });
}

socket.on('stream', (data) => {
    const { streamId, stream } = data;
    if (streamId !== socket.id) {
        const remoteVideo = document.createElement('video');
        remoteVideo.srcObject = stream;
        remoteVideo.autoplay = true;
        remoteVideos.appendChild(remoteVideo);
        peerConnections[streamId] = new RTCPeerConnection();
        stream.getTracks().forEach((track) => {
            peerConnections[streamId].addTrack(track, stream);
        });
    }
});

socket.on('remove-stream', (streamId) => {
    const remoteVideo = document.querySelector(`[data-stream-id="${streamId}"]`);
    if (remoteVideo) {
        remoteVideo.parentNode.removeChild(remoteVideo);
        delete peerConnections[streamId];
    }
});

function sendMessage(messageType, payload) {
    socket.emit('message', { type: messageType, payload: payload });
}

socket.on('message', (data) => {
    const { type, payload } = data;
    switch (type) {
        case 'offer':
            handleOffer(payload);
            break;
        case 'answer':
            handleAnswer(payload);
            break;
        case 'ice-candidate':
            handleIceCandidate(payload);
            break;
        default:
            break;
    }
});

function offerPeerConnection() {
    Object.keys(peerConnections).forEach((peerId) => {
        const peerConnection = peerConnections[peerId];
        peerConnection.createOffer()
            .then((offer) => {
                return peerConnection.setLocalDescription(offer);
            })
            .then(() => {
                sendMessage('offer', { offer: peerConnection.localDescription, to: peerId });
            })
            .catch((error) => {
                console.error('Error creating offer:', error);
            });
    });
}

function handleOffer(data) {
    const { offer, from } = data;
    const peerConnection = new RTCPeerConnection();
    peerConnection.setRemoteDescription(offer)
        .then(() => {
            return navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        })
        .then((stream) => {
            localStream = stream;
            localVideo.srcObject = stream;
            stream.getTracks().forEach((track) => {
                peerConnection.addTrack(track, stream);
            });
        })
        .then(() => {
            return peerConnection.createAnswer();
        })
        .then((answer) => {
            return peerConnection.setLocalDescription(answer);
        })
        .then(() => {
            sendMessage('answer', { answer: peerConnection.localDescription, to: from });
        })
        .catch((error) => {
            console.error('Error handling offer:', error);
        });
}

function handleAnswer(data) {
    const { answer, from } = data;
    const peerConnection = peerConnections[from];
    peerConnection.setRemoteDescription(answer)
        .catch((error) => {
            console.error('Error handling answer:', error);
        });
}

function handleIceCandidate(data) {
    const { candidate, from } = data;
    const peerConnection = peerConnections[from];
    if (peerConnection) {
        peerConnection.addIceCandidate(candidate)
            .catch((error) => {
                console.error('Error adding ICE candidate:', error);
            });
    }
}

document.getElementById('startScreenShare').addEventListener('click', () => {
    startScreenSharing();
});

document.getElementById('stopScreenShare').addEventListener('click', () => {
    stopScreenSharing();
});
