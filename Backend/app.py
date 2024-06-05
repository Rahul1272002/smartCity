from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import cv2
import math
from ultralytics import YOLO
import cvzone
import time
import firebase_admin
from firebase_admin import credentials, storage

# Initialize Firebase
cred = credentials.Certificate("serviceAccount.json")
firebase_admin.initialize_app(cred, {"storageBucket": "college-project-4b23c.appspot.com"})

app = Flask(__name__)
CORS(app)

def store_image(img, filename):
    try:
        cv2.imwrite(filename, img)
        bucket = storage.bucket()
        blob = bucket.blob(filename)
        blob.upload_from_filename(filename)
        blob.make_public()
        download_url = blob.public_url
        os.remove(filename)
        return download_url
    except Exception as e:
        print(e)
        return None


UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
classNames = ['bad_billboard', 'broken_signage', 'clutter_sidewalk', 'construction_road', 'construction_waste', 'garbage', 'graffiti', 'potholes', 'sand_on_road']

classNames2 = ['BAD BILLBOARD', 'BAD STREETLIGHT', 'BROKEN_SIGNAGE', 'CLUTTER_SIDEWALK', 'CONSTRUCTION ROAD', 'FADED SIGNAGE', 'GARBAGE', 'GRAFFITI', 'POTHOLES', 'SAND ON ROAD', 'UNKEPT_FACADE']

images_folder_path = "./uploads/images"
output_folder_path = "./uploads/output"
os.makedirs(output_folder_path, exist_ok=True)

def detect(image_path, original_filename, model=YOLO("./models/best6.pt")):
    img = cv2.imread(image_path)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    results = model(img, stream=True)
    detected = False
    detected_names = []
    for r in results:
        boxes = r.boxes
        for box in boxes:
            x1, y1, x2, y2 = box.xyxy[0]
            x1, y1, x2, y2 = int(x1), int(y1), int(x2), int(y2)
            cv2.rectangle(img, (x1, y1), (x2, y2), (0, 0, 255), 2)
            conf = math.ceil((box.conf[0] * 100)) / 100
            label = int(box.cls[0])

            if classNames2[label] in classNames2 and conf:
                print(classNames2[label], conf)
                detected_names.append(classNames2[label])
                detected = True
                cvzone.putTextRect(img, f"{classNames2[label]}", (max(0, x1), max(35, y1 - 10)), 2, 1, (0, 255, 0), 2)
    # Construct filename for the output image
    _, original_image_name = os.path.split(original_filename)
    filename = f"result_{original_image_name}_{time.time()}.jpg"
    download_url = store_image(img, filename)
    output_image_path = os.path.join(output_folder_path, filename)
    cv2.imwrite(output_image_path, cv2.cvtColor(img, cv2.COLOR_RGB2BGR))
    return detected, output_image_path, detected_names, download_url



@app.route('/')
def hello_world():
    return jsonify({'message': 'Hello, World!'})

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'files[]' not in request.files:
        return jsonify({'message': 'No file part'}), 400
    else:
        files = request.files.getlist('files[]')
        result_data = []
        download_urls = []
        detected_names_list = []
        for file in files:
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], file.filename))
            # Detect objects in the uploaded image
            detected, result_file, detected_names, download_url = detect(os.path.join(app.config['UPLOAD_FOLDER'], file.filename), file.filename)
            if detected:
                result_data.append({'file': result_file})
                download_urls.append(download_url)
                detected_names_list.append(detected_names)
    if result_data:
        return jsonify({'message': 'File uploaded and objects detected', "download_url": download_urls, 'detected_names': detected_names_list}), 200
    else:
        return jsonify({'message': 'File uploaded but no objects detected'}), 200


if __name__ == '__main__':
    app.run( debug=True)
