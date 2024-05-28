from flask import Flask, redirect, url_for, session, request
from authlib.integrations.flask_client import OAuth

app = Flask(__name__)
app.secret_key = 'your_secret_key_here'
oauth = OAuth(app)

google = oauth.register(
    name='google',
    client_id='your_google_client_id',
    client_secret='your_google_client_secret',
    authorize_url='https://accounts.google.com/o/oauth2/auth',
    authorize_params=None,
    access_token_url='https://accounts.google.com/o/oauth2/token',
    access_token_params=None,
    refresh_token_url=None,
    redirect_uri='http://localhost:8000/auth/google/callback',
    client_kwargs={'scope': 'openid profile email'}
)

@app.route('/')
def home():
    return 'Welcome!'

@app.route('/login')
def login():
    return google.authorize_redirect(redirect_uri=url_for('auth', _external=True))

@app.route('/auth/google/callback')
def auth():
    token = google.authorize_access_token()
    user = google.parse_id_token(token)
    # Save user data to session or database as needed
    return redirect(url_for('profile'))

if __name__ == '__main__':
    app.run(debug=True)
