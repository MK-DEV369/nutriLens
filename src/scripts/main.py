from Model import execute_model
from PaddlePart import preprocess_image 
import os

image_directory = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'components', 'scan', 'table-image.png'))

def main(user_id, weight_of_food):
    preprocess_image(image_directory)
    ans = execute_model(user_id, weight_of_food)
    return ans