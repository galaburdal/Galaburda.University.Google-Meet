from flask import Flask, render_template, request, redirect, url_for, flash
from flask_bcrypt import Bcrypt
from flask_mail import Mail, Message
from azure_setup import create_web_app

app = Flask(__name__)
bcrypt = Bcrypt(app)
mail = Mail(app)

app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USERNAME'] = 'tokt57394@gmail.com'
app.config['MAIL_PASSWORD'] = 'Parol.357'
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        email = request.form['email']
        password = bcrypt.generate_password_hash(request.form['password']).decode('utf-8')
        # Store username, email, and password securely (e.g., in a database)
        resource_group_name = "google-meet"
        app_name = "googlemeet"
        site = create_web_app(resource_group_name, app_name)

        # Send welcome email
        send_welcome_email(email)

        flash('User registered successfully! Check your email for a welcome message.', 'success')
        return redirect(url_for('home'))
    return render_template('register.html')

def send_welcome_email(email):
    msg = Message('Welcome to Google Meet', sender='your-email@gmail.com', recipients=[email])
    msg.body = 'Thank you for registering!'
    mail.send(msg)

if __name__ == '__main__':
    app.run(debug=True)
