from flask import Flask, render_template
from flask_socketio import SocketIO, emit

app = Flask(__name__)
socketio = SocketIO(app)

participants = set()

@app.route('/')
def index():
    return render_template('index.html')

@socketio.on('connect')
def handle_connect():
    print('Client connected')

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

@socketio.on('join')
def join(data):
    participant_id = data['id']
    participants.add(participant_id)
    print('Participant joined:', participant_id)
    emit('participants_updated', list(participants), broadcast=True)

@socketio.on('leave')
def leave(data):
    participant_id = data['id']
    participants.remove(participant_id)
    print('Participant left:', participant_id)
    emit('participants_updated', list(participants), broadcast=True)

if __name__ == '__main__':
    socketio.run(app, debug=True)
