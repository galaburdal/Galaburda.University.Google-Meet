from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/register', methods=['POST'])
def register():
    # Handle registration logic
    return jsonify({'message': 'User registered successfully'})

if __name__ == '__main__':
    app.run(debug=True)
