from flask import Flask,request,jsonify
from flask_restful import Api,Resource
from roboflow import Roboflow
from flask_cors import CORS
import supervision as sv
import cv2
import os
import numpy as np
import base64
app = Flask(__name__)
api = Api(app)
CORS(app)
class FootPath(Resource):
    def post(self):
        try:
            if 'image' not in request.files:
                return jsonify({'Error': 'Image not received'})

            image = request.files['image']
            image_path = os.path.join('backend','uploads', image.filename)
            print(image_path)
            image.save(image_path)

            rf = Roboflow(api_key="M9rjZCp90i9HHyoDgdEC")
            project = rf.workspace().project("orr")
            model = project.version(1).model

            result = model.predict(image_path, confidence=40)

            if hasattr(result, 'json'):
                result = result.json()

            detections = sv.Detections.from_inference(result)
            image = cv2.imread(image_path)
            masks = detections.mask
            if len(masks) > 0:
                totalPixels = sum(mask.size for mask in masks)
                footpathPixels = np.count_nonzero(masks[0])  # Assuming you're using the first mask
                footpathPercentage = (footpathPixels / totalPixels) * 100 if totalPixels else 0
            else:
                footpathPercentage = 0

            print(f"Prediction complete: {footpathPercentage}% footpath detected")

            return jsonify({'Percentage': footpathPercentage})

        except Exception as e:
            print(f"Error processing request: {str(e)}")
            return jsonify({'Error': str(e)})


api.add_resource(FootPath,'/upload-image')

if __name__ == '__main__':
    app.run(debug=True)

