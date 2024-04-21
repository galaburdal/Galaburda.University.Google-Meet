import app
from flask import Flask, render_template
from flask_socketio import SocketIO
from chat import app as chat_app

app.register_blueprint(chat_app, url_prefix='/chat')

app = Flask(__name__)
app.config['SECRET_KEY'] = 'i_love_very_my_dog'
socketio = SocketIO(app)

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    socketio.run(app)
