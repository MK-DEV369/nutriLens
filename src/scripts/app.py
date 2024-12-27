from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from main import main

app = Flask(__name__)
CORS(app) 


UPLOAD_FOLDER = '../components/scan'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

@app.route('/health',methods=['GET'])
def get_res():
    return jsonify({"msg":"Server is healthy"})

@app.route('/', methods=['POST'])
def handle_request():
    weight = request.form.get('weight')
    choice = request.form.get('choice')
    image = request.files.get('image')

    if not weight or not choice or not image:
        return jsonify({"error": "Missing required fields"}), 400

    image_path = os.path.join(UPLOAD_FOLDER, 'captured_img.png')
    image.save(image_path) 
    
    result = main(1,60)
    print(result)
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)
