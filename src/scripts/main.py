from Model import execute_model
from PaddlePart import preprocess_image 
import os
import asyncio

image_directory = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'components', 'scan', 'table-image.png'))

async def main(user_id, weight_of_food):
    while not os.path.exists(image_directory):
        await asyncio.sleep(0.1)
    preprocess_result = preprocess_image(image_directory)
    print(f"Preprocessing result: {preprocess_result}")
    
    result = execute_model(user_id, weight_of_food)
    print(f"Model execution result: {result}")

    return result