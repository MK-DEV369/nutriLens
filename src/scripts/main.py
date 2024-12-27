from Model import execute_model
from PaddlePart import preprocess_image 

image_directory = ".\components\scan\target-image.png"

def main(user_id,weight_of_food):
    preprocess_image(image_directory)
    ans = execute_model(user_id,weight_of_food)

    return ans