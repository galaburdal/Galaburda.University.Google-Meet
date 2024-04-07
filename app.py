from flask import Flask, render_template, request, redirect, url_for, flash
from flask_bcrypt import Bcrypt
from azure_setup import create_web_app

app = Flask(__name__)
bcrypt = Bcrypt(app)

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
        flash('User registered successfully!', 'success')
        return redirect(url_for('home'))
    return render_template('register.html')

if __name__ == '__main__':
    app.run(debug=True)