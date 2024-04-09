# main.py

from flask import Flask, render_template, request, redirect, url_for
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your_secret_key_here'
socketio = SocketIO(app)

@app.route('/')
def index():
    return render_template('index.html')

@socketio.on('register')
def handle_register(data):
    # Handle user registration logic here
    username = data['username']
    email = data['email']
    # Save user data to database or perform necessary actions
    emit('registration-success', {'message': 'Registration successful'}, broadcast=True)

if __name__ == '__main__':
    socketio.run(app)
