from flask import Flask, render_template, request, redirect, url_for

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/new_meeting', methods=['POST'])
def new_meeting():
    meeting_code = generate_meeting_code()
    return redirect(f"/?meeting_link={meeting_code}")

def generate_meeting_code():
    return 'your-meeting-code-here'

if __name__ == '__main__':
    app.run(debug=True)