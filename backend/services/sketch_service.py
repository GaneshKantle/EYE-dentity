import numpy as np
import cv2
import base64
from models.sketch_model import AccuratePencilSketchRecognizer

recognizer = AccuratePencilSketchRecognizer()

def decode_image(image_data):
    image_data = base64.b64decode(image_data.split(",")[1])
    nparr = np.frombuffer(image_data, np.uint8)
    return cv2.imdecode(nparr, cv2.IMREAD_COLOR)

def register_sketch(name, image_data):
    image = decode_image(image_data)
    features = recognizer.extract_accurate_features(image)
    recognizer.sketch_database['names'].append(name)
    recognizer.sketch_database['features'].append(features)
    recognizer.sketch_database['original_sketches'].append(image)
    return {"message": f"Sketch '{name}' registered successfully"}

def recognize_sketch(image_data):
    image = decode_image(image_data)
    name, confidence = recognizer.recognize_from_image(image)
    return {"match": name, "confidence": confidence}
