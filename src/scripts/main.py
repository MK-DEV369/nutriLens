from Model import execute_model
from PaddlePart import preprocess_image 
import os
import asyncio

image_directory = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'components', 'scan', 'table-image.png'))

async def main(user_id, weight_of_food):
    while not os.path.exists(image_directory):
        await asyncio.sleep(0.1)
    preprocess_image(image_directory)
    result = execute_model(user_id, weight_of_food)
    return result