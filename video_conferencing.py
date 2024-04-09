from flask import Flask, render_template
from flask_socketio import SocketIO, emit

app = Flask(__name__)
socketio = SocketIO(app)

@app.route('/')
def index():
    return render_template('video_conferencing.html')

@socketio.on('connect')
def handle_connect():
    print('Client connected')

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

@socketio.on('offer')
def handle_offer(offer):
    print('Received offer:', offer)
    emit('answer', offer, broadcast=True)

if __name__ == '__main__':
    socketio.run(app, debug=True)
