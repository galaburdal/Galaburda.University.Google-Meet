import pc
from flask import Flask
from flask_socketio import SocketIO, emit
from aiortc import RTCPeerConnection, RTCSessionDescription
from aiortc.contrib.media import ScreenShare

app = Flask(__name__)
socketio = SocketIO(app)

@socketio.on('start_share')
def start_share():
    @socketio.on('sdp')
    def on_sdp(data):
        if data['type'] == 'offer':
            offer = RTCSessionDescription(sdp=data['sdp'], type=data['type'])
            pc = RTCPeerConnection()
            pc.addTrack(ScreenShare('screen'), streams)
            answer = pc.createAnswer()
            pc.setLocalDescription(answer)
            emit('sdp', {'sdp': answer.sdp, 'type': answer.type})

    @socketio.on('ice')
    def on_ice(data):
        pc.addIceCandidate(data['candidate'])

if __name__ == '__main__':
    socketio.run(app, debug=True)
