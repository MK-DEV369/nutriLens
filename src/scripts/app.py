from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from werkzeug.utils import secure_filename
from main import main

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'components', 'scan'))

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

@app.route('/health', methods=['GET'])
def get_res():
    return jsonify({"msg": "Server is healthy"})

@app.route('/api/upload', methods=['POST'])
async def handle_request():
    weight = request.form.get('weight')
    choice = request.form.get('choice')
    image = request.files.get('image')

    if not weight or not choice or not image:
        return jsonify({"error": "Missing required fields"}), 400

    filename = secure_filename(image.filename)
    image_path = os.path.join(UPLOAD_FOLDER, filename)
    image.save(image_path)

    try:
        result = await main(filename, float(weight))
        print(result)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)