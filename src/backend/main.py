from model import execute_model
from image_processor import process_image 
import os

image_directory = "./src/backend/uploads/captured_img.png"

def main(choice, weight_of_food):
    try:
        if not os.path.exists(image_directory):
            raise FileNotFoundError(f"The image file {image_directory} does not exist.")
        
        process_image(image_directory)
        ans = execute_model(choice, weight_of_food)
        return ans
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return None

if __name__ == "__main__":
    main("default_choice", "default_weight")