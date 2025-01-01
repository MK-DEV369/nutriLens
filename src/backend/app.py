from bson.objectid import ObjectId
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from main import main
from pymongo import MongoClient
from dotenv import load_dotenv
import json

load_dotenv()
app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = './src/backend/uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

print("Starting Flask server...")
MONGODB_URI = os.environ.get("MONGODB_URI")
client = MongoClient(MONGODB_URI)
db = client['nutrilens']
user_profiles_collection = db['userprofiles']

def object_id_to_string(obj):
    if isinstance(obj, dict):
        return {k: object_id_to_string(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [object_id_to_string(item) for item in obj]
    elif isinstance(obj, ObjectId):
        return str(obj)
    else:
        return obj

@app.route('/health', methods=['GET'])
def get_res():
    print("Health check received")
    return jsonify({"msg": "Server is healthy"})

@app.route('/', methods=['POST'])
@app.route('/api/upload', methods=['POST'])
def process_image():
    print("Received POST request to /api/upload")
    try:
        weight = request.form.get('weight')
        image = request.files.get('image')
        user_id = request.form.get('userId')
        print(f"Received data: weight={weight}, image={image}, userId={user_id}")
        if not weight or not image:
            return jsonify({"error": "Missing required fields"}), 400
        if not user_id:
            return jsonify({"error": "User ID is required"}), 400
        
        user_profile = user_profiles_collection.find_one({'clerkId': user_id})
        if not user_profile:
            return jsonify({"error": "User profile not found"}), 404
        
        print("User Profile:", json.dumps(object_id_to_string(user_profile), indent=2))
        image_path = os.path.join(UPLOAD_FOLDER, 'captured_img.png')
        image.save(image_path)        
        result = main(determine_choice(user_profile), int(weight))  # Use the serving size from the request
        print(result)
        return jsonify(object_id_to_string(result))
    
    except Exception as e:
        print(f"Error occurred: {str(e)}")
        return jsonify({"error": str(e)}), 500

def determine_choice(user_profile):
    special_needs = user_profile.get('specialNeeds', [])
    age = user_profile.get('age')
    gender = user_profile.get('gender')

    if special_needs:
        if 'Hypertension' in special_needs:
            return 9
        elif 'Obesity' in special_needs:
            return 7
        elif 'Diabetes' in special_needs:
            return 8
        elif 'Pregnant' in special_needs:
            return 3
    else:
        if gender == 'Male':
            if age >= 19 and age <= 30:
                return 1
            elif age >= 31 and age <= 50:
                return 1
            else:
                return 1
        elif gender == 'Female':
            if age >= 19 and age <= 30:
                return 2
            elif age >= 31 and age <= 50:
                return 2
            else:
                return 2
        else:
            return 1    
    return 1

if __name__ == '__main__':
    app.run(port=5001, host='0.0.0.0', debug=True)