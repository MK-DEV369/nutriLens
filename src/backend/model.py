import csv

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
    "FIBER": 35,  # Not listed
    "CALCIUM": 1000,
    "MAGNESIUM": 440,
    "IRON": 27,
    "ZINC": 14.5,
    "IODINE": 220,
    "THIAMINE": 2.0,
    "RIBOFLAVIN": 2.7,
    "ENERGY": 2000,
    "NIACIN": 16,  # Increment by 2
    "VITAMIN_B6": 2.3,
    "FOLATE": 570,
    "VITAMIN_B12": 2.4,  # Increment by 0.25
    "VITAMIN_C": 80,  # Increment by 15
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

    "PROTEINS": 60,      # Slightly increased for better glycemic control and muscle health
    "FIBER": 50,         # Higher intake to aid blood sugar regulation
    "CALCIUM": 1000,     # No change; essential for bone health
    "MAGNESIUM": 500,    # Increased; helps improve insulin sensitivity
    "ENERGY": 2000,    
    "IRON": 19,          # No change; standard requirement
    "ZINC": 17,          # No change; supports immune function
    "IODINE": 140,       # No change; essential for thyroid health
    "THIAMINE": 2.0,     # Slightly increased; helps glucose metabolism
    "RIBOFLAVIN": 2.5,   # No change
    "NIACIN": 18,        # No change
    "VITAMIN_B6": 2.5,   # Slightly increased; supports nerve health
    "FOLATE": 400,       # Increased; aids cardiovascular health
    "VITAMIN_B12": 2.5,  # Slightly increased for nerve function
    "VITAMIN_C": 90,     # Slightly increased; combats oxidative stress
    "VITAMIN_A": 900,    # Slightly reduced; as excessive Vitamin A may harm glycemic control
    "VITAMIN_D": 800,    # Increased; supports insulin sensitivity
    "SUGAR": 25,         # Added sugar limit (grams/day); focus on natural sugars from whole foods
    "TOTAL_FAT": 70,           # Total fat (grams/day); focus on healthy fats like unsaturated fats
    "CARBOHYDRATES": 130, # Minimum daily intake (grams/day); focus on low glycemic index carbs
    "SATURATED_FAT": 22,
    "SODIUM": 1500 ,      # Reduced limit (milligrams/day) to manage blood pressure and heart health
   "CHOLESTEROL":200,
}

obesity_dict = {
    "PROTEINS": 70,       # Increased to support muscle mass preservation during weight loss
    "FIBER": 40,          # Increased for better satiety and digestive health
    "CALCIUM": 1000,      # No change; essential for bone health
    "MAGNESIUM": 400,     # Increased to support metabolic processes
    "ENERGY": 1800,       # Reduced total energy intake to support weight loss
    "IRON": 18,           # No change; standard requirement
    "ZINC": 15,           # No change; supports immune function
    "IODINE": 150,        # No change; essential for thyroid health
    "THIAMINE": 1.5,      # Slightly reduced as overall intake is lowered
    "RIBOFLAVIN": 1.5,    # No change
    "NIACIN": 16,         # No change
    "VITAMIN_B6": 2.0,    # Slightly increased for energy metabolism
    "FOLATE": 400,        # Increased for cardiovascular health and weight management
    "VITAMIN_B12": 2.4,   # No change
    "VITAMIN_C": 90,      # Slightly increased to help with immune function and antioxidant protection
    "VITAMIN_A": 800,     # Reduced to avoid excess intake
    "VITAMIN_D": 800,     # Increased to support metabolic health
    "SUGAR": 20,          # Limited sugar intake, focusing on whole foods and natural sugars
    "TOTAL_FAT": 60,      # Reduced fat intake, with emphasis on healthy fats
    "CARBOHYDRATES": 130, # Controlled intake of low-glycemic index carbs
    "SATURATED_FAT": 15,  # Reduced to improve lipid profiles
    "SODIUM": 2000  ,      # Moderate sodium intake to support heart health
    "CHOLESTEROL":200,

}

hypertension_dict = {
    "PROTEINS": 70,       # No change; standard intake for muscle maintenance
    "FIBER": 35,          # Increased for better digestive health and heart function
    "CALCIUM": 1200,      # Increased for blood pressure regulation
    "MAGNESIUM": 450,     # Increased to support heart health and blood pressure management
    "ENERGY": 1800,       # Moderate calorie intake for weight management and blood pressure control
    "IRON": 18,           # No change; standard requirement
    "ZINC": 15,           # No change; supports immune function
    "IODINE": 150,        # No change; essential for thyroid health
    "THIAMINE": 1.5,      # No change; essential for carbohydrate metabolism
    "RIBOFLAVIN": 1.5,    # No change
    "NIACIN": 16,         # No change
    "VITAMIN_B6": 2.5,    # Slightly increased to support nerve health
    "FOLATE": 400,        # Increased for cardiovascular and heart health
    "VITAMIN_B12": 2.4,   # No change
    "VITAMIN_C": 90,      # Increased for antioxidant protection
    "VITAMIN_A": 800,     # Moderate intake to avoid excess, while supporting health
    "VITAMIN_D": 800,     # Increased for heart and bone health
    "SUGAR": 15,          # Limited sugar intake to avoid weight gain and blood sugar spikes
    "TOTAL_FAT": 60,      # Focus on unsaturated fats, reduced total fat intake
    "CARBOHYDRATES": 130, # Controlled intake of complex carbs, avoiding high-glycemic index foods
    "SATURATED_FAT": 15,  # Reduced to help manage cholesterol and blood pressure
    "SODIUM": 1500 ,       # Reduced sodium intake to help manage hypertension
     "CHOLESTEROL":200,
}

def findDict(choice):
    
    if choice==1:
        d_dict=men_dict
    elif choice==2:
        d_dict=women_dict
    elif choice==3:
        d_dict=pregnant_women_dict
    elif choice==4:
        d_dict=children_10_12_years_dict
    elif choice==5:
        d_dict=children_13_15_years_dict
    elif choice==6:
        d_dict=children_16_18_years_dict
    elif choice==7:
        d_dict=obesity_dict
    elif choice==8:
        d_dict=diabetes_dict
    elif choice==9:
        d_dict=hypertension_dict
    
    return d_dict

# Function to read a CSV file into a dictionary
def csv_to_dict(csv_file):
    data_dict = {}
    with open(csv_file, mode='r', newline='') as file:
        csv_reader = csv.reader(file)
        for row in csv_reader:
            key, value = row
            if key.strip() in men_dict:
                data_dict[key.strip()] = float(value.strip())
    return data_dict

#### how much do u want to consume????
# Convert per 100g values to RDA percentages
def convert_to_rda(per100g_value, rda_value, weight_of_food):
    return round(((per100g_value * weight_of_food) / (100 * rda_value)) * 100, 4)


###### gender , age , diabetes , bp , weight , pregnancy
def convert_dict_to_rda(d_dict,data_dict, weight_of_food):
    print("hi")
    print(dict)
    print("ny")
    return {key: convert_to_rda(value, d_dict[key], weight_of_food) for key, value in data_dict.items()}

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
    countbenef10=0
    countrda=0
    for key, value in good_dict.items():
        arr = dict_benef[key]
        countrda+=value
        if value >= arr[0]:
            print("10benef")
            countbenef10+=1
            num += 10 * arr[2]
        elif arr[1] <= value < arr[0]:
            print("8bene")
            num += 8 * arr[2]
        else:
            print("2bene")
            x = max(2, 10 - (arr[0] / value) * 1.5)
            num += x * arr[2]
        den += arr[2]
    return num, den ,countbenef10,countrda


# Adjusted scoring algorithm for liability nutrients
def score_liability(bad_dict):
    num, den = 0, 0
    countliab10=0
    countrda=0
    for key, value in bad_dict.items():
        arr = dict_liab[key]
        countrda+=value
        if value <= arr[0]:
            print("10liab")
            countliab10+=1
            num += 10 * arr[2]
        elif arr[0] < value <= arr[1]:
            print("8liab")
            num += 8 * arr[2]  # Reduced penalty
        else:
           
            x=value/arr[0]
            x=10-1.5*x
            x = max(-1, 10 - (value / arr[0]) * 1.5)  # Less severe penalty scamling
            print("xliab"+str(x))
            num += x * arr[2]
        den += arr[2]

    return num, den,countliab10,countrda

import csv
import os

# File to write the CSV data
csv_file = "DATASET.csv"

# Function to append dictionary to CSV file
def append_dict_to_csv(file, data, all_keys):
    file_exists = os.path.isfile(file)

    # Open the file in append mode
    with open(file, mode='a', newline='\n', encoding='utf-8') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=all_keys)

        # If file doesn't exist, write the header first
        if not file_exists:
            writer.writeheader()

        # Fill missing keys with empty values
        complete_data = {key: data.get(key, "") for key in all_keys}

        # Write the row data
        writer.writerow(complete_data)

    print(f"Data appended to {file} successfully!")

# List of all possible keys (columns)
# Missing "Name" and "Age"
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
def execute_model(choice,weight_of_food):

    user_dict = findDict(choice)
    
    data_dict = csv_to_dict("cleaned_nutrition_data.csv")  # Example CSV file
    data_dict = convert_dict_to_rda(user_dict,data_dict, weight_of_food)
    print(data_dict)

    good_dict, bad_dict = separate_dict(data_dict)
    goodx=len(good_dict)
    badx=len(bad_dict)

    num_good, den_good,countbenef10,count_rda_good = score_beneficial(good_dict)
    num_bad, den_bad ,countliab10,count_rda_bad= score_liability(bad_dict)


    final_rating = round((num_good + num_bad) / (den_good + den_bad), 4)
    
    print(str(count_rda_good)+"   "+str(count_rda_bad))
    
    print(str(goodx)+"goodnum"+str(badx))
    update=0
    if(goodx==badx and goodx>=4):
      badx+=1
    if goodx>badx:
        update=round((((count_rda_good*goodx)-(count_rda_bad*badx))/((goodx*100)-(badx*100))),4)
    elif goodx<badx:
        update=round((((count_rda_bad*badx)-(count_rda_good*goodx))/((goodx*100)-(badx*100))),4)
        if update < -3:
            update=-3

    elif final_rating<8.5:
        final_rating+=count_rda_good/count_rda_bad
    
    print(update)
    final_rating+=update
    print("Final Rating:", final_rating)


    data_dict["FINAL_RATING"] = final_rating
    print(data_dict)

    # Append the dictionaries to the CSV file
    append_dict_to_csv(csv_file, data_dict, nutrients_dict)

    return final_rating,data_dict































# import pandas as pd
# def update_dataframe_with_dict(csv_file_path, dict_data, output_file_path):
#     """
#     This function updates a CSV file's DataFrame with values from a given dictionary.

#     :param csv_file_path: str, path to the input CSV file
#     :param dict_data: dict, dictionary with key-value pairs to update the DataFrame columns
#     :param output_file_path: str, path to save the updated CSV file
#     """
#     # Load the CSV file into a DataFrame
#     df = pd.read_csv(csv_file_path)

#     # Iterate over the dictionary and update the DataFrame
#     for key, value in dict_data.items():
#         if key in df.columns:
#             # If the column exists, update it with the dictionary value
#             df[key] = value
#         else:
#             # If the column doesn't exist, add it with the value from the dictionary
#             df[key] = value

#     # Save the updated DataFrame back to a CSV
#     df.to_csv(output_file_path, index=False)

#     # Return the updated DataFrame (optional, just for verification or further processing)
#     return df

# # Example usage
# csv_file_path = 'BRUHCSV.csv'  # Replace with your actual CSV file path
# output_file_path = 'updated_file.csv'

# # Call the function
# updated_df = update_dataframe_with_dict(csv_file_path, data_dict, output_file_path)

# # Print the resulting DataFrame to check the changes
# print(updated_df)


#     ## ADDING REMAINING NUTRIENTS
#     ## ADD REMAINING DICTS
#     ## DECIDE ALL INPUTS REQUIRED FROM USER
#     ## CREATING THE DATASET
    

# # ## age , gender , pregnency , amount of consumption , (are u consuming the food??) , diabetes , obesity , high bp . weight , height 
    # elif count_rda_good>count_rda_bad:
    #     x=10-final_rating
    #     count=countbenef10+countliab10
    #     x=x/count
    #     final_rating+=x