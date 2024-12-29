import csv
import os
from pymongo import MongoClient
from dotenv import load_dotenv

men_dict = {
    "PROTEINS": 54,
    "FIBER": 40,
    "CALCIUM": 1000,
    "MAGNESIUM": 440,
    "IRON": 19,
    "ZINC": 17,
    "IODINE": 140,
    "THIAMINE": 1.8,
    "RIBOFLAVIN": 2.5,
    "NIACIN": 18,
    "VITAMIN_B6": 2.4,
    "FOLATE": 300,
    "VITAMIN_B12": 2.2,
    "VITAMIN_C": 80,
    "VITAMIN_A": 1000,
    "VITAMIN_D":600,
    "TOTAL_FAT":67,
    "ENERGY": 2000,
    "CARBOHYDRATES": 130,
    "SUGAR": 50,
    "TOTAL_FAT": 67,
    "SATURATED_FAT": 22,
    "SODIUM": 2000,
    "CHOLESTEROL":300
}

women_dict = {
    "PROTEINS": 46,
    "FIBER": 30,
    "CALCIUM": 1000,
    "MAGNESIUM": 370,
    "IRON": 29,
    "ZINC": 13.2,
    "IODINE": 140,
    "THIAMINE": 1.7,
    "ENERGY": 2000,
    "RIBOFLAVIN": 2.4,
    "NIACIN": 14,
    "VITAMIN_B6": 1.9,
    "FOLATE": 220,
    "VITAMIN_B12": 2.2,
    "VITAMIN_C": 65,
    "VITAMIN_A": 840,
    "SUGAR": 50,
    "TOTAL_FAT": 67,
    "SATURATED_FAT": 22, 
    "SODIUM": 2000,    
    "VITAMIN_D": 600,
    "CHOLESTEROL":300,
    "CARBOHYDRATES": 130,
}

pregnant_women_dict = {
    "PROTEINS": 60,
    "FIBER": 35,
    "CALCIUM": 1000,
    "MAGNESIUM": 440,
    "IRON": 27,
    "ZINC": 14.5,
    "IODINE": 220,
    "THIAMINE": 2.0,
    "RIBOFLAVIN": 2.7,
    "ENERGY": 2000,
    "NIACIN": 16,
    "VITAMIN_B6": 2.3,
    "FOLATE": 570,
    "VITAMIN_B12": 2.4,
    "VITAMIN_C": 80,
    "VITAMIN_A": 900,
    "VITAMIN_D":600,
    "SUGAR": 50,
    "TOTAL_FAT": 67,
    "SATURATED_FAT": 22,
    "SODIUM": 2000,
    "CHOLESTEROL":300,
    "CARBOHYDRATES": 130,
}

children_10_12_years_dict = {
    "PROTEINS": 32.0,
    "FIBER": 33,
    "CALCIUM": 850,
    "MAGNESIUM": 240,
    "IRON": 16,
    "ZINC": 8.5,
    "IODINE": 100,
    "THIAMINE": 1.5,
    "ENERGY": 2000,
    "RIBOFLAVIN": 2.1,
    "NIACIN": 15,
    "VITAMIN_B6": 2.0,
    "FOLATE": 220,
    "VITAMIN_B12": 2.2,
    "VITAMIN_C": 55,
    "VITAMIN_A": 770,
    "VITAMIN_D": 600,
    "SODIUM": 2000,
    "SUGAR": 50,
    "TOTAL_FAT": 67,
    "SATURATED_FAT": 22,
    "CHOLESTEROL":300,
    "CARBOHYDRATES": 130,

}

children_13_15_years_dict = {
    "PROTEINS": 45.0,
    "FIBER": 43,
    "CALCIUM": 1000,
    "MAGNESIUM": 345,
    "IRON": 22,
    "ZINC": 14.3,
    "IODINE": 140,
    "THIAMINE": 1.9,
    "ENERGY": 2000,
    "RIBOFLAVIN": 2.7,
    "NIACIN": 19,
    "VITAMIN_B6": 2.6,
    "FOLATE": 285,
    "VITAMIN_B12": 2.2,
    "VITAMIN_C": 70,
    "VITAMIN_A": 930,
    "VITAMIN_D": 600,
    "SODIUM": 2000,
    "SUGAR": 50,
    "TOTAL_FAT": 67,
    "SATURATED_FAT": 22,
    "CHOLESTEROL":300,
    "CARBOHYDRATES": 130,

}

children_16_18_years_dict = {
    "PROTEINS": 55.0,
    "FIBER": 50,
    "CALCIUM": 1050,
    "MAGNESIUM": 440,
    "IRON": 26,
    "ZINC": 17.6,
    "IODINE": 140,
    "THIAMINE": 2.2,
    "RIBOFLAVIN": 3.1,
    "NIACIN": 22,
    "VITAMIN_B6": 3.0,
    "FOLATE": 340,
    "ENERGY": 2000,
    "VITAMIN_B12": 2.2,
    "VITAMIN_C": 85,
    "VITAMIN_A": 1000,
    "VITAMIN_D": 600,
    "SODIUM": 2000,
    "SUGAR": 50,
    "TOTAL_FAT": 67,
    "SATURATED_FAT": 22,
    "CHOLESTEROL":300,
    "CARBOHYDRATES": 130,

}

diabetes_dict = {

    "PROTEINS": 60,
    "FIBER": 50,
    "CALCIUM": 1000,
    "MAGNESIUM": 500,
    "ENERGY": 2000,    
    "IRON": 19,
    "ZINC": 17,
    "IODINE": 140,
    "THIAMINE": 2.0,
    "RIBOFLAVIN": 2.5,
    "NIACIN": 18,
    "VITAMIN_B6": 2.5,
    "FOLATE": 400,
    "VITAMIN_B12": 2.5,
    "VITAMIN_C": 90,
    "VITAMIN_A": 900,
    "VITAMIN_D": 800,
    "SUGAR": 25,
    "TOTAL_FAT": 70,
    "CARBOHYDRATES": 130,
    "SATURATED_FAT": 22,
    "SODIUM": 1500 ,
    "CHOLESTEROL":200,
}

obesity_dict = {
    "PROTEINS": 70,
    "FIBER": 40,
    "CALCIUM": 1000,
    "MAGNESIUM": 400,
    "ENERGY": 1800,
    "IRON": 18,
    "ZINC": 15,
    "IODINE": 150,
    "THIAMINE": 1.5,
    "RIBOFLAVIN": 1.5,
    "NIACIN": 16,
    "VITAMIN_B6": 2.0,
    "FOLATE": 400,
    "VITAMIN_B12": 2.4,
    "VITAMIN_C": 90,
    "VITAMIN_A": 800,
    "VITAMIN_D": 800,
    "SUGAR": 20,
    "TOTAL_FAT": 60, 
    "CARBOHYDRATES": 130,
    "SATURATED_FAT": 15,
    "SODIUM": 2000,
    "CHOLESTEROL":200,

}

hypertension_dict = {
    "PROTEINS": 70,
    "FIBER": 35,
    "CALCIUM": 1200,
    "MAGNESIUM": 450,
    "ENERGY": 1800,
    "IRON": 18,
    "ZINC": 15,
    "IODINE": 150,
    "THIAMINE": 1.5,
    "RIBOFLAVIN": 1.5,
    "NIACIN": 16,
    "VITAMIN_B6": 2.5,
    "FOLATE": 400,
    "VITAMIN_B12": 2.4,
    "VITAMIN_C": 90,
    "VITAMIN_A": 800,
    "VITAMIN_D": 800,
    "SUGAR": 15,
    "TOTAL_FAT": 60,
    "CARBOHYDRATES": 130,
    "SATURATED_FAT": 15,
    "SODIUM": 1500 ,
    "CHOLESTEROL":200,
}

load_dotenv()

def get_user_profile(user_id):
    """Fetch user profile from MongoDB by user ID."""
    try:
        MONGO_URI = os.getenv('MONGO_URI')
        if not MONGO_URI:
            raise ValueError("MongoDB URI not found in environment variables")
        client = MongoClient(MONGO_URI)
        db = client['nutrilens']
        collection = db['userprofiles']
        user_profile = collection.find_one({"clerkId": user_id})

        if not user_profile:
            raise ValueError(f"No user profile found for user ID: {user_id}")

        return user_profile
    except Exception as e:
        print(f"Error fetching user profile: {e}")
        raise

def userChoice(special_needs, age, gender):
    """Map special needs, age, and gender to a choice value."""
    mapping = {
        "Obesity": 7,
        "Diabetes": 8,
        "High BP": 9,
        "Pregnancy": 3,
        "Hypertension": 9,
    }
    for need in special_needs:
        if need in mapping:
            return mapping[need]
    if gender.lower() == "male":
        return 1
    elif gender.lower() == "female":
        return 2
    elif age <= 12:
        return 4
    elif 13 <= age <= 15:
        return 5
    elif 16 <= age <= 18:
        return 6

    raise ValueError("Unable to determine a choice based on user profile")

def findDict(user_id):
    """Determine the nutrient dictionary based on user profile."""
    user_profile = get_user_profile(user_id)
    special_needs = user_profile.get("specialNeeds", [])
    age = user_profile.get("age", 0)
    gender = user_profile.get("gender", "")
    choice = userChoice(special_needs, age, gender)
    nutrient_dict = {
        1: men_dict,
        2: women_dict,
        3: pregnant_women_dict,
        4: children_10_12_years_dict,
        5: children_13_15_years_dict,
        6: children_16_18_years_dict,
        7: obesity_dict,
        8: diabetes_dict,
        9: hypertension_dict,
    }.get(choice)
    if nutrient_dict is None:
        raise ValueError("Invalid choice for nutrient dictionary")
    return nutrient_dict

def csv_to_dict(csv_file):
    try:
        data_dict = {}
        with open(csv_file, mode='r', newline='') as file:
            csv_reader = csv.reader(file)
            for row in csv_reader:
                key, value = row
                if key.strip() in men_dict:
                    data_dict[key.strip()] = float(value.strip())
        return data_dict
    except Exception as e:
        print(f"Error reading CSV file: {str(e)}")
        return {}

# Convert per 100g values to RDA percentages based on Consumption
def convert_to_rda(per100g_value, rda_value, weight_of_food):
    return round(((per100g_value * weight_of_food) / (100 * rda_value)) * 100, 4)


###### gender , age , diabetes , bp , weight , pregnancy
def convert_dict_to_rda(d_dict, data_dict, weight_of_food):
    try:
        return {key: convert_to_rda(value, d_dict[key], weight_of_food) for key, value in data_dict.items()}
    except Exception as e:
        print(f"Error converting to RDA: {str(e)}")
        return {}

# Beneficial nutrients (good impact)
benef = [
    "PROTEINS", "FIBER", "CALCIUM", "MAGNESIUM", "IRON", 
    "ZINC", "IODINE", "THIAMINE", "RIBOFLAVIN", "NIACIN", 
    "VITAMIN_B6", "FOLATE", "VITAMIN_B12", "VITAMIN_C", 
    "VITAMIN_A", "VITAMIN_D", "ENERGY", "CARBOHYDRATES"
]

# Liability nutrients (harmful impact)
liab = [
    "SUGAR", "TOTAL_FAT", "SATURATED_FAT", "SODIUM", "CHOLESTEROL"
]


# Refined critical values for scoring beneficial nutrients
dict_benef = {
    "PROTEINS": [25, 15, 5],       # High protein value is beneficial
    "FIBER": [30, 20, 5],          # Fiber is critical for good health
    "CALCIUM": [25, 15, 3],        # Calcium for strong bones
    "MAGNESIUM": [25, 15, 3],      # Magnesium for muscle function
    "IRON": [20, 10, 4],           # Iron for blood health
    "ZINC": [25, 15, 3],           # Zinc for immune system
    "IODINE": [20, 10, 3],         # Iodine for thyroid health
    "THIAMINE": [15, 10, 2],       # Vitamin B1 importance
    "RIBOFLAVIN": [20, 10, 2],     # Vitamin B2 importance
    "NIACIN": [20, 10, 2],         # Vitamin B3 importance
    "VITAMIN_B6": [20, 10, 2],     # Vitamin B6 for metabolism
    "FOLATE": [30, 15, 3],         # Folate for cell growth
    "VITAMIN_B12": [30, 15, 3],    # Vitamin B12 for nerve function
    "VITAMIN_C": [20, 10, 4],      # Vitamin C for immune health
    "VITAMIN_A": [30, 20, 5],      # Vitamin A for vision and immunity
    "VITAMIN_D": [25, 15, 3],      # Vitamin D for bone health
    "ENERGY": [20, 10, 4],         # Energy content
    "CARBOHYDRATES": [25, 12, 3]   # Carbohydrates for energy
}

# Refined critical values for scoring liability nutrients
dict_liab = {
    "SUGAR": [15, 25, 4],
    "TOTAL_FAT": [20, 30, 4],
    "SATURATED_FAT": [5, 12, 3],
    "SODIUM": [20, 30, 2],
    "CHOLESTEROL": [10, 20, 4]
}

# Separate data into beneficial and liability categories
def separate_dict(data_dict):
    good_dict = {key: value for key, value in data_dict.items() if key in benef}
    bad_dict = {key: value for key, value in data_dict.items() if key in liab}
    return good_dict, bad_dict

# Scoring algorithm for beneficial nutrients
def score_beneficial(good_dict):
    num, den = 0, 0
    countbenef10 = 0
    countrda = 0
    for key, value in good_dict.items():
        arr = dict_benef[key]
        countrda += value
        if value >= arr[0]:
            countbenef10 += 1
            num += 10 * arr[2]
        elif arr[1] <= value < arr[0]:
            num += 8 * arr[2]
        else:
            x = max(2, 10 - (arr[0] / value) * 1.5)
            num += x * arr[2]
        den += arr[2]
    return num, den, countbenef10, countrda

# Adjusted scoring algorithm for liability nutrients
def score_liability(bad_dict):
    num, den = 0, 0
    countliab10 = 0
    countrda = 0
    for key, value in bad_dict.items():
        arr = dict_liab[key]
        countrda += value
        if value <= arr[0]:
            countliab10 += 1
            num += 10 * arr[2]
        elif arr[0] < value <= arr[1]:
            num += 8 * arr[2]
        else:
            x = value / arr[0]
            x = 10 - 1.5 * x
            x = max(-1, 10 - (value / arr[0]) * 1.5)
            num += x * arr[2]
        den += arr[2]
    return num, den, countliab10, countrda

csv_file = "DATASET.csv"

def append_dict_to_csv(file, data, all_keys):
    try:
        file_exists = os.path.isfile(file)
        with open(file, mode='a', newline='\n', encoding='utf-8') as csvfile:
            writer = csv.DictWriter(csvfile, fieldnames=all_keys)
            if not file_exists:
                writer.writeheader()
            complete_data = {key: data.get(key, "") for key in all_keys}
            writer.writerow(complete_data)
        print(f"Data appended to {file} successfully!")
    except Exception as e:
        print(f"Error appending to CSV file: {str(e)}")

nutrients_dict = {
    "PROTEINS": None,
    "FIBER": None,
    "CALCIUM": None,
    "MAGNESIUM": None,
    "IRON": None,
    "ZINC": None,
    "IODINE": None,
    "THIAMINE": None,
    "RIBOFLAVIN": None,
    "NIACIN": None,
    "VITAMIN_B6": None,
    "FOLATE": None,
    "VITAMIN_B12": None,
    "VITAMIN_C": None,
    "VITAMIN_A": None,
    "VITAMIN_D": None,
    "ENERGY": None,
    "CARBOHYDRATES": None,
    "SUGAR": None,
    "TOTAL_FAT": None,
    "SATURATED_FAT": None,
    "SODIUM": None,
    "CHOLESTEROL": None,
    "FINAL_RATING":None
}

# Main execution
def execute_model(user_id, weight_of_food):
    try:        
        user_profile = get_user_profile(user_id) # Fetch user profile from MongoDB
        special_needs = user_profile.get("specialNeeds", []) # Extract details from user profile
        age = user_profile.get("age", 0)
        gender = user_profile.get("gender", "")
        choice = choice(special_needs, age, gender) # Map to a choice value
        user_dict = findDict(user_id) # Determine the nutrient dictionary based on user profile
        data_dict = csv_to_dict("cleaned_nutrition_data.csv") # Read nutrition data from CSV file
        data_dict = convert_dict_to_rda(user_dict, data_dict, weight_of_food) # Convert data to RDA percentages
        good_dict, bad_dict = separate_dict(data_dict) # Separate beneficial and liability nutrients
        num_good, den_good, countbenef10, count_rda_good = score_beneficial(good_dict) # Score beneficial nutrients
        num_bad, den_bad, countliab10, count_rda_bad = score_liability(bad_dict) # Score liability nutrients
        final_rating = round((num_good + num_bad) / (den_good + den_bad), 4) # Calculate final rating
        goodx = len(good_dict) # Adjust final rating based on nutrient balance
        badx = len(bad_dict)        
        update = 0
        if goodx == badx and goodx >= 4:
            badx += 1
        if goodx > badx:
            update = round((((count_rda_good * goodx) - (count_rda_bad * badx)) / ((goodx * 100) - (badx * 100))), 4)
        elif goodx < badx:
            update = round((((count_rda_bad * badx) - (count_rda_good * goodx)) / ((goodx * 100) - (badx * 100))), 4)
            if update < -3:
                update = -3
        final_rating += update # Apply update to final rating
        final_rating = max(0, min(final_rating, 10)) # Ensure final rating is within a reasonable range
        data_dict["FINAL_RATING"] = final_rating # Add final rating to data dictionary
        append_dict_to_csv(csv_file, data_dict, nutrients_dict) # Append data to CSV file  
        return final_rating, data_dict    
    except Exception as e:
        print(f"Error in execute_model: {e}")
        return None, None
