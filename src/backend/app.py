from bson.objectid import ObjectId
#from bson.objectid import dumps
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from main import main
from pymongo import MongoClient
from dotenv import load_dotenv
import json
from datetime import datetime
import traceback

load_dotenv()
app = Flask(__name__)
CORS(app, origins=[
    "http://localhost:5001",
    "http://192.168.1.3:5001",
    "https://nutri-lens-seven.vercel.app:5001"
])

UPLOAD_FOLDER = './src/backend/uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

print("Starting Flask server...")
MONGODB_URI = os.environ.get("MONGODB_URI")
client = MongoClient(MONGODB_URI)
db = client['nutrilens']
user_profiles_collection = db['userprofiles']
history_collection = db['history']

@app.route('/save-history', methods=['POST'])
def save_history():
    try:
        data = request.json
        history_entry = {
            "userId": data["userId"],
            "date": datetime.utcnow().strftime('%Y-%m-%d'),
            "name": data["name"],
            "final_rating" :data["final_rating"],
            "calories": data["calories"]
        }
        history_collection.insert_one(history_entry)
        return jsonify({"message": "History entry saved successfully"}), 201
    except Exception as e:
        print(f"Error details: {str(e)}")
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


@app.route('/get-history/<userId>', methods=['GET'])
def get_history(userId):
    try:
        print(f"Attempting to retrieve history for user: {userId}")
        entries = list(history_collection.find({"userId": userId}, {"_id": 0}))
        if not entries:
            print(f"No history found for user: {userId}")
            return jsonify([]), 200
        print(f"Found {len(entries)} entries for user {userId}")
        return jsonify(entries), 200
    except Exception as e:
        print(f"Error fetching history for user {userId}: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@app.route('/user-profile/<userId>', methods=['GET'])
def get_user_profile(userId):
    try:
        user_profile = user_profiles_collection.find_one({"clerkId": userId}, {"_id": 0})
        if not user_profile:
            return jsonify({"error": "User profile not found"}), 404
        return jsonify(user_profile), 200
    except Exception as e:
        print(f"Error fetching user profile: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/delete-entry', methods=['POST'])
def delete_entry():
    try:
        data = request.json
        user_id = data["userId"]
        entry_id = data["entryId"]
        date, name = entry_id.split(' ', 1)
        
        result = history_collection.delete_one({
            "userId": user_id,
            "date": date,
            "name": name
        })
        
        if result.deleted_count == 0:
            return jsonify({"error": "Entry not found"}), 404
        else:
            return jsonify({"message": "Entry deleted successfully"}), 200
    except Exception as e:
        print(f"Error deleting entry: {str(e)}")
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500
    
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