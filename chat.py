from flask import Flask, render_template
from flask_socketio import SocketIO, emit

app = Flask(__name__)
socketio = SocketIO(app)

@app.route('/chat')
def chat():
    return render_template('chat.html')

@socketio.on('message')
def handle_message(data):
    print('Message received:', data)
    emit('message', data, broadcast=True)

if __name__ == '__main__':
    socketio.run(app, debug=True)