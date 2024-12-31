from model import execute_model
from image_processor import process_image 

image_directory = "./uploads/captured_img.png"

def main(choice,weight_of_food):
    process_image(image_directory)
    ans = execute_model(choice,weight_of_food)

    return ans