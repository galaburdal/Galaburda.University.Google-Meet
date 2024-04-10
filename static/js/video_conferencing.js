
const socket = io();

let localStream;
let peerConnections = {};

document.getElementById('startCall').addEventListener('click', async () => {
    try {
        localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        document.getElementById('localVideo').srcObject = localStream;
        socket.emit('join', { streamId: socket.id });

        socket.on('stream', (data) => {
            const { streamId, stream } = data;
            if (streamId !== socket.id) {
                const remoteVideo = document.createElement('video');
                remoteVideo.srcObject = stream;
                remoteVideo.autoplay = true;
                document.getElementById('remoteVideos').appendChild(remoteVideo);

                const peerConnection = new RTCPeerConnection();
                peerConnection.addStream(localStream);
                peerConnection.onicecandidate = (event) => {
                    if (event.candidate) {
                        socket.emit('iceCandidate', { candidate: event.candidate, to: streamId });
                    }
                };
                peerConnections[streamId] = peerConnection;
                peerConnection.createOffer()
                    .then((offer) => peerConnection.setLocalDescription(offer))
                    .then(() => {
                        socket.emit('offer', { offer: peerConnection.localDescription, to: streamId });
                    })
                    .catch((error) => {
                        console.error('Error creating offer:', error);
                    });
            }
        });

        socket.on('remove-stream', (streamId) => {
            const remoteVideo = document.querySelector(`video[data-stream-id="${streamId}"]`);
            if (remoteVideo) {
                remoteVideo.parentNode.removeChild(remoteVideo);
                delete peerConnections[streamId];
            }
        });

        socket.on('offer', (data) => {
            const { offer, from } = data;
            const peerConnection = new RTCPeerConnection();
            peerConnection.addStream(localStream);
            peerConnection.setRemoteDescription(offer)
                .then(() => peerConnection.createAnswer())
                .then((answer) => peerConnection.setLocalDescription(answer))
                .then(() => {
                    socket.emit('answer', { answer: peerConnection.localDescription, to: from });
                })
                .catch((error) => {
                    console.error('Error creating answer:', error);
                });
        });

        socket.on('answer', (data) => {
            const { answer, from } = data;
            peerConnections[from].setRemoteDescription(answer);
        });

        socket.on('iceCandidate', (data) => {
            const { candidate, from } = data;
            peerConnections[from].addIceCandidate(candidate);
        });

    } catch (error) {
        console.error('Error getting user media:', error);
    }
});

document.getElementById('endCall').addEventListener('click', () => {
    localStream.getTracks().forEach(track => track.stop());
    localStream = null;
    document.getElementById('localVideo').srcObject = null;
    socket.emit('leave', { streamId: socket.id });
    document.getElementById('remoteVideos').innerHTML = '';
    Object.keys(peerConnections).forEach((streamId) => {
        peerConnections[streamId].close();
    });
});
