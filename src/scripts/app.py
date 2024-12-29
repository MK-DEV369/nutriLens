from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from pymongo import MongoClient
from datetime import datetime
from werkzeug.utils import secure_filename
from main import main
from dotenv import load_dotenv
# from ChatbotPrompt import generate_description_and_suggestions

app = Flask(__name__)
CORS(app)

load_dotenv()
MONGO_URI = os.getenv('MONGO_URI')
client = MongoClient(MONGO_URI)
db = client['nutrilens']
history_collection = db['history']
user_profiles_collection = db['userprofiles']

UPLOAD_FOLDER = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'components', 'scan'))

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

@app.route('/health', methods=['GET'])
def get_res():
    return jsonify({"msg": "Server is healthy"})

@app.route('/api/upload', methods=['POST'])
async def handle_request():
    weight = request.form.get('weight')
    food_name = request.form.get('foodName')
    image = request.files.get('image')
    user_id = request.form.get('userId')
    if not weight or not food_name or not image or not user_id:
        return jsonify({"error": "Missing required fields"}), 400
    image_path = os.path.join(UPLOAD_FOLDER, 'table-image.png')
    image.save(image_path)
    
    try:
        final_rating, critical_values = await main(user_id=user_id, weight_of_food=float(weight))
        user_profile = user_profiles_collection.find_one({"clerkId": user_id})
        # scan_description, food_suggested = generate_description_and_suggestions(
        #     user_profile, final_rating, critical_values
        # )
        # if final_rating and scan_description and food_suggested:
        #     history_entry = {
        #         "UserId": user_id,
        #         "TimeStamp": datetime.now(),
        #         "foodName": food_name,
        #         "FinalRating": final_rating,
        #         "CriticalValues": critical_values,
        #         "ScanDescription": scan_description,
        #     }
        #     history_collection.insert_one(history_entry)
        return jsonify({"FinalRating": final_rating}) #, "ScanDescription": scan_description
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
