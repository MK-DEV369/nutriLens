# %%
# Install PaddleOCR and necessary libraries
# !pip install paddleocr protobuf==3.20.2


# %%
##hello
import cv2
from paddleocr import PaddleOCR
import numpy as np
import csv
import tensorflow as tf

# %%
# Initialize PaddleOCR
ocr = PaddleOCR(lang='en')

# Define the image path
image_dir = "FoodLabels"
image_path = f"{image_dir}/Image_AlooBhuji_160.png"


# %%
def preprocess_image(image_path):
    # Load image
    image = cv2.imread(image_path)
    
    # Convert to grayscale
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    
    # Apply Gaussian Blur to reduce noise
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    
    # Use adaptive thresholding to enhance text visibility
    thresholded = cv2.adaptiveThreshold(blurred, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, 
                                        cv2.THRESH_BINARY, 11, 2)
    
    # Resize image if necessary (for better OCR accuracy)
    resized = cv2.resize(thresholded, (0, 0), fx=1.5, fy=1.5)

    return resized




# %%
# Preprocess the image before OCR
image = preprocess_image(image_path)

# Save the cleaned image to a new file
cv2.imwrite("cleaned_image.jpg", image)

# %%
image_path="cleaned_image.jpg"

# Perform OCR on the image
ocr_results = ocr.ocr(image_path)

print(ocr_results)


# %%
# Extract Bounding Boxes
boxes=[]
texts=[]
probabilities=[]
for line in ocr_results:
    # print(line)
    for i in line:
        boxes.append(i[0])
        texts.append(i[1][0])
        probabilities.append(i[1][1])

print(boxes)
print(texts)
print(probabilities)


# %%
def highlight_boxes_with_probabilities(image_path, ocr_results):
    # Load the image
    image = cv2.imread(image_path)

    # Loop through OCR results and highlight regions (boxes) on the image
    for line in ocr_results:
        for i in line:
            # Get bounding box coordinates (points)
            box = np.array(i[0], dtype=np.int32)  # Coordinates of the box
            text = i[1][0]  # Extracted text
            probability = i[1][1]  # Probability (confidence score)
            
            # Draw the bounding box around the detected text with a dark color
            points = box.reshape((-1, 1, 2))
            cv2.polylines(image, [points], isClosed=True, color=(0, 0, 255), thickness=2)  # Dark Red
            
            # Place the probability text near the bounding box in dark color
            x_min = np.min(box[:, 0])
            y_min = np.min(box[:, 1])
            cv2.putText(image, f'{probability:.2f}', (x_min, y_min - 10), 
                        cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 0, 255), 2, cv2.LINE_AA)  # Dark Red text
    
    # Save or display the image with highlighted boxes and probabilities
    output_image_path = 'highlighted_image_dark.jpg'
    cv2.imwrite(output_image_path, image)
    print(f"Image with highlighted boxes saved as {output_image_path}")

highlight_boxes_with_probabilities(image_path,ocr_results)

# %%
# Helper function to check if boxes are aligned
def are_boxes_aligned(box1, box2, axis="horizontal", threshold=10):
    """Check if two boxes are aligned either horizontally or vertically."""
    if axis == "horizontal":
        return abs(box1[0][1] - box2[0][1]) < threshold
    elif axis == "vertical":
        return abs(box1[0][0] - box2[0][0]) < threshold


# %%
# Detect tables based on alignment
table_candidates = []
used_boxes = set()

# %%
for i, box1 in enumerate(boxes):
    row_group = [i]  # Initialize a new group
    for j, box2 in enumerate(boxes):
        if j != i and are_boxes_aligned(box1, box2, axis="horizontal"):
            row_group.append(j)
    if len(row_group) > 1:  # Only consider groups with more than one element
        table_candidates.append(row_group)
        used_boxes.update(row_group)

# %%
print(row_group)

# %%
# Save the image with detected table regions
cv2.imwrite("detected_tables.jpg", image)

# %%
image_cv = cv2.imread(image_path)
image_height = image_cv.shape[0]
image_width = image_cv.shape[1]

# %%
im = image_cv.copy()

# %%
horiz_boxes = []
vert_boxes = []

for box in boxes:
  x_h, x_v = 0,int(box[0][0])
  y_h, y_v = int(box[0][1]),0
  width_h,width_v = image_width, int(box[2][0]-box[0][0])
  height_h,height_v = int(box[2][1]-box[0][1]),image_height

  horiz_boxes.append([int(x_h),int(y_h),int(x_h+width_h),int(y_h+height_h)])
  vert_boxes.append([int(x_v),int(y_v),int(x_v+width_v),int(y_v+height_v)])

  cv2.rectangle(im,(x_h,y_h), (x_h+width_h,y_h+height_h),(0,0,255),1)
  cv2.rectangle(im,(x_v,y_v), (x_v+width_v,y_v+height_v),(0,255,0),1)


# %%
cv2.imwrite('horiz_vert.jpg',im)

# %%
horiz_boxes = [[int(value) for value in row] for row in horiz_boxes]
print(horiz_boxes)
print(probabilities)

# %%
horiz_out = tf.image.non_max_suppression(
    horiz_boxes,
    probabilities,
    max_output_size = 1000,
    iou_threshold=0.1,
    score_threshold=float('-inf'),
    name=None
)

# %%
horiz_lines = np.sort(np.array(horiz_out))
print(horiz_lines)

# %%
im_nms = image_cv.copy()

# %%
for val in horiz_lines:
    cv2.rectangle(im_nms, 
                  (int(horiz_boxes[val][0]), int(horiz_boxes[val][1])), 
                  (int(horiz_boxes[val][2]), int(horiz_boxes[val][3])), 
                  (0, 0, 255),  # Color in BGR (Red in this case)
                  thickness=3)   # Increase the thickness to 3 (or higher for thicker lines)

# %%
vert_out = tf.image.non_max_suppression(
    vert_boxes,
    probabilities,
    max_output_size = 1000,
    iou_threshold=0.1,
    score_threshold=float('-inf'),
    name=None
)

# %%
print(vert_out)

# %%
vert_lines = np.sort(np.array(vert_out))
print(vert_lines)

# %%
cv2.imwrite('im_nms.jpg',im_nms)

# %%
out_array = [["" for i in range(len(vert_lines))] for j in range(len(horiz_lines))]
print(np.array(out_array).shape)
print(out_array)

# %%
unordered_boxes = []

for i in vert_lines:
  print(vert_boxes[i])
  unordered_boxes.append(vert_boxes[i][0])

# %%
ordered_boxes = np.argsort(unordered_boxes)
print(ordered_boxes)

# %%
def intersection(box_1, box_2):
  return [box_2[0], box_1[1],box_2[2], box_1[3]]

# %%
def iou(box_1, box_2):

  x_1 = max(box_1[0], box_2[0])
  y_1 = max(box_1[1], box_2[1])
  x_2 = min(box_1[2], box_2[2])
  y_2 = min(box_1[3], box_2[3])

  inter = abs(max((x_2 - x_1, 0)) * max((y_2 - y_1), 0))
  if inter == 0:
      return 0

  box_1_area = abs((box_1[2] - box_1[0]) * (box_1[3] - box_1[1]))
  box_2_area = abs((box_2[2] - box_2[0]) * (box_2[3] - box_2[1]))

  return inter / float(box_1_area + box_2_area - inter)

# %%
for i in range(len(horiz_lines)):
  for j in range(len(vert_lines)):
    resultant = intersection(horiz_boxes[horiz_lines[i]], vert_boxes[vert_lines[ordered_boxes[j]]] )

    for b in range(len(boxes)):
      the_box = [boxes[b][0][0],boxes[b][0][1],boxes[b][2][0],boxes[b][2][1]]
      if(iou(resultant,the_box)>0.1):
        out_array[i][j] = texts[b]

# %%
out_array=np.array(out_array)

# %%
out_array

# %%


# %%
import pandas as pd

# %%
pd.DataFrame(out_array).to_csv('Final_Table.csv')

# %%
import re
from rapidfuzz import process, fuzz

# Updated list of known nutrients
KNOWN_NUTRIENTS = [
    "ENERGY",
    "PROTEINS",
    "TOTAL_FAT",
    "SATURATED_FAT",
    "TRANS_FAT",
    "CHOLESTEROL",
    "CARBOHYDRATES",
    "FIBER",
    "SUGAR",
    "ADDED SUGARS",
    "SODIUM",
    "POTASSIUM",
    "CALCIUM",
    "IRON",
    "MAGNESIUM",
    "ZINC",
    "VITAMIN_A",
    "VITAMIN_C",
    "VITAMIN_D",
    "VITAMIN_E",
    "VITAMIN_K",
    "VITAMIN_B6",
    "VITAMIN_B12",
    "FOLATE",
    "NIACIN",
    "THIAMINE",
    "RIBOFLAVIN",
    "PHOSPHORUS",
    "SELENIUM",
    "COPPER",
    "MANGANESE"
]

# Function to clean and process the data
def clean_data(file_path, output_path):
    # Read the CSV file, remove unwanted columns, and drop empty rows
    df = pd.read_csv(file_path, header=None)  # Read file without assuming headers
    columns_to_drop = [0, 3]  # Columns to drop
    columns_to_drop = [col for col in columns_to_drop if col in df.columns]  # Only drop if present
    df = df.drop(columns=columns_to_drop, errors="ignore").dropna(how="all").reset_index(drop=True)

    # List to store cleaned data and set to track processed nutrients
    cleaned_data = []
    processed_nutrients = set()  # To avoid duplicate nutrients

    # Loop through each row in the data
    for _, row in df.iterrows():
        # Get nutrient name and amount value
        nutrient_name = str(row[1]).strip().upper()  # Clean and standardize nutrient name
        amount_value = str(row[2]).strip()  # Clean amount value

        # Find the closest match for the nutrient name
        match, score, _ = process.extractOne(
            nutrient_name, KNOWN_NUTRIENTS, scorer=fuzz.partial_ratio
        )

        # Additional specificity check: Avoid confusing similar nutrient names
        if score > 70 and match not in processed_nutrients:  # Ensure no repetition
            # Extract the numeric value from the amount column
            match_amount = re.search(r"\b(\d+(?:\.\d+)?)\s*(?:[a-zA-Z]*)\b", amount_value)  # Look for numbers
            if match_amount:
                amount = float(match_amount.group(1))  # Convert number to a float

                # Skip if amount is 0
                if amount != 0:
                    cleaned_data.append([match, amount])  # Add the valid nutrient and amount to the list
                    processed_nutrients.add(match)  # Mark this nutrient as processed
                else:
                    print(f"Skipped row (amount is zero): {nutrient_name} - {amount_value}")
            else:
                print(f"Skipped row (no valid amount found): {nutrient_name} - {amount_value}")
        elif match in processed_nutrients:
            print(f"Skipped duplicate nutrient: {match}")
        else:
            print(f"Skipped row (no valid nutrient match): {nutrient_name}")

    # Save the cleaned data to a new CSV file without column names
    pd.DataFrame(cleaned_data).to_csv(output_path, index=False, header=False)
    print(f"Cleaned data saved to {output_path}")

# Example usage
input_file = "Final_Table.csv"  # Input file path
output_file = "cleaned_nutrition_data.csv"  # Output file path
clean_data(input_file, output_file)


