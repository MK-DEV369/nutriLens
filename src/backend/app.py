from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from main import main

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = './src/backend/uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

print("Starting Flask server...")

@app.route('/health', methods=['GET'])
def get_res():
    print("Health check received")
    return jsonify({"msg": "Server is healthy"})

@app.route('/', methods=['POST'])
@app.route('/api/upload', methods=['POST'])
def handle_request():
    print("Received POST request to /api/upload")
    try:
        weight = request.form.get('weight')
        choice = request.form.get('foodName')
        image = request.files.get('image')

        print(f"Received data: weight={weight}, choice={choice}, image={image}")

        if not weight or not choice or not image:
            return jsonify({"error": "Missing required fields"}), 400
        
        image_path = os.path.join(UPLOAD_FOLDER, 'captured_img.png')
        image.save(image_path)
        
        result = main(1,60)
        print(result)
        return jsonify(result)
    
    except Exception as e:
        print(f"Error occurred: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5001, host='0.0.0.0', debug=True)