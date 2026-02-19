from flask import Flask, request, jsonify, Response
from flask_cors import CORS
import torch
import torch.nn as nn
import cv2


from torchvision import transforms
import timm
from PIL import Image
import io
import os
import time

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes


# --- Load Models ---
# Define the device
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

def load_breed_model():
    try:
        print("Loading Breed EfficientNet-B0 model (timm)...")
        model = timm.create_model('efficientnet_b0', pretrained=False, num_classes=2)
        base_dir = os.path.abspath(os.path.dirname(__file__))
        model_path = os.path.join(base_dir, "best_model_v2.pth")
        
        if not os.path.exists(model_path):
            model_path = os.path.join(os.path.dirname(base_dir), "best_model_v2.pth")

        checkpoint = torch.load(model_path, map_location=device)
        state_dict = checkpoint['state_dict'] if isinstance(checkpoint, dict) and 'state_dict' in checkpoint else checkpoint
        
        new_state_dict = {}
        for k, v in state_dict.items():
            if k.startswith('module.'): new_state_dict[k[7:]] = v
            else: new_state_dict[k] = v
        
        model.load_state_dict(new_state_dict, strict=False)
        model = model.to(device)
        model.eval()
        print("Breed Model loaded successfully")
        return model
    except Exception as e:
        print(f"Error loading breed model: {e}")
        return None

import torchvision.models as models

def load_weight_model():
    try:
        print("Loading Weight EfficientNet-B0 regression model (torchvision)...")
        # Regression model has 1 output class
        # Use torchvision as the checkpoint has 'features.*' keys
        model = models.efficientnet_b0(weights=None)
        # Modify the head for 1 regression output
        # Torchvision EfficientNet head is a Sequential: [Dropout, Linear]
        in_features = model.classifier[1].in_features
        model.classifier[1] = nn.Linear(in_features, 1)
        
        base_dir = os.path.abspath(os.path.dirname(__file__))
        model_path = os.path.join(base_dir, "cow_weight_b0_best.pth")
        if not os.path.exists(model_path):
            model_path = os.path.join(os.path.dirname(base_dir), "cow_weight_b0_best.pth")

        if not os.path.exists(model_path):
            print(f"Weight model file NOT FOUND at: {model_path}")
            return None

        checkpoint = torch.load(model_path, map_location=device)
        state_dict = checkpoint['state_dict'] if isinstance(checkpoint, dict) and 'state_dict' in checkpoint else checkpoint
        
        # Standardize keys (remove 'module.' if present)
        new_state_dict = {}
        for k, v in state_dict.items():
            if k.startswith('module.'): new_state_dict[k[7:]] = v
            else: new_state_dict[k] = v
        
        model.load_state_dict(new_state_dict, strict=True)
        model = model.to(device)
        model.eval()
        print("Weight Model (Torchvision) loaded successfully")
        return model
    except Exception as e:
        print(f"Error loading weight model: {e}")
        return None

breed_model = load_breed_model()
weight_model = load_weight_model()

# --- Prediction Params ---
MAX_WEIGHT = 1000.0
CLASS_NAMES = ['Gir', 'Kankrej'] 

# --- Image Preprocessing ---
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

@app.route('/', methods=['GET'])
def home():
    return jsonify({
        'status': 'running',
        'message': 'SmartCattle AI Backend is Active',
        'models_loaded': {
            'breed': breed_model is not None,
            'weight': weight_model is not None
        }
    })

# --- Validator Model (MobileNetV3) ---
def load_validator_model():
    try:
        print("Loading Validator MobileNetV3 model...")
        weights = models.MobileNet_V3_Small_Weights.DEFAULT
        model = models.mobilenet_v3_small(weights=weights)
        model = model.to(device)
        model.eval()
        print("Validator Model loaded successfully")
        return model
    except Exception as e:
        print(f"Error loading validator model: {e}")
        return None

validator_model = load_validator_model()

# ImageNet indices: 345 (ox), 346 (water buffalo), 347 (bison)
CATTLE_INDICES = [345, 346, 347]

def is_bovine(input_tensor):
    if not validator_model: return True
    with torch.no_grad():
        outputs = validator_model(input_tensor)
        probabilities = torch.nn.functional.softmax(outputs, dim=1)
        top5_prob, top5_catid = torch.topk(probabilities, 5)
        for i in range(5):
            idx = top5_catid[0][i].item()
            if idx in CATTLE_INDICES:
                print(f"Validator: Approved (Class {idx})")
                return True
        print(f"Validator: Rejected (Highest Class {top5_catid[0][0].item()})")
        return False

# --- Initial Configuration ---
CONFIG = {
    'ai_threshold': 75.0,
    'rfid_enabled': True,
    'cctv_enabled': False,
    'cctv_url': 'rtsp://admin:admin123@192.168.1.55:554/live',
    'notification_email': 'admin@smartcattle.ai',
    'language': 'English',
    'units': 'Metric (kg)'
}

def gen_frames():
    """Video streaming generator function."""
    camera_url = CONFIG.get('cctv_url')
    source = int(camera_url) if camera_url.isdigit() else camera_url
    camera = cv2.VideoCapture(source)
    while True:
        success, frame = camera.read()
        if not success:
            camera.release()
            time.sleep(2)
            camera = cv2.VideoCapture(source)
            continue
        else:
            ret, buffer = cv2.imencode('.jpg', frame)
            frame = buffer.tobytes()
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

@app.route('/video_feed')
def video_feed():
    """Video streaming route. Put this in the src attribute of an img tag."""
    if not CONFIG.get('cctv_enabled'):
        return "CCTV Disabled in Settings", 403
    return Response(gen_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/settings', methods=['GET'])
def get_settings():
    return jsonify(CONFIG)

@app.route('/settings', methods=['POST'])
def update_settings():
    data = request.json
    for key in data:
        if key in CONFIG:
            CONFIG[key] = data[key]
    return jsonify({'status': 'success', 'config': CONFIG})

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    try:
        image_bytes = file.read()
        image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
        input_tensor = transform(image).unsqueeze(0).to(device)

        result = {}

        # Validate if the image is a cow/bovine using MobileNet
        if not is_bovine(input_tensor):
            result['is_cow'] = False
            result['status'] = 'Non-Cattle Detected'
            result['breed'] = 'Undefined'
            result['confidence'] = 0
            return jsonify(result)
            
        result['is_cow'] = True
        result['status'] = 'Cattle Detected'

        # Breed Inference
        if breed_model:
            with torch.no_grad():
                outputs = breed_model(input_tensor)
                probabilities = torch.nn.functional.softmax(outputs, dim=1)
                confidence, predicted_class = torch.max(probabilities, 1)
                
                confidence_score = confidence.item() * 100
                predicted_label = CLASS_NAMES[predicted_class.item()]
                threshold = CONFIG.get('ai_threshold', 75.0)
                
                print(f"AI Check: Class={predicted_label}, Confidence={confidence_score:.2f}%")
                
                # If confidence is low, it's likely not a cow or a different breed
                # For a 2-class model, non-cow images often score 50-70%. We need a strict threshold.
                if confidence_score < 80.0:
                    result['is_cow'] = False
                    result['status'] = 'Unknown Asset Detected'
                    predicted_label = "Undefined"
                elif confidence_score < threshold:
                    # It is a cow (high confidence), but maybe below user 'verification' threshold
                    predicted_label = "Undefined"
                    result['status'] = 'Unrecognized Breed'
                
                result['breed'] = predicted_label
                result['confidence'] = round(confidence_score, 2)
        
        # Weight Inference
        if weight_model and result.get('is_cow', True):
            with torch.no_grad():
                weight_output = weight_model(input_tensor)
                normalized_weight = weight_output.item()
                real_weight = round(normalized_weight * MAX_WEIGHT, 1)
                result['estimated_weight'] = real_weight
                result['unit'] = 'kg'
                print(f"AI Regression: Estimated Weight = {real_weight}kg")

        return jsonify(result)

    except Exception as e:
        print(f"Prediction error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/predict_weight', methods=['POST'])
def predict_weight():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    if weight_model is None:
        return jsonify({'error': 'Weight model not loaded'}), 500

    try:
        image_bytes = file.read()
        image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
        input_tensor = transform(image).unsqueeze(0).to(device)

        with torch.no_grad():
            output = weight_model(input_tensor)
            weight = round(output.item() * MAX_WEIGHT, 2)

        return jsonify({
            'estimated_weight': weight,
            'unit': 'kg'
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000, host='0.0.0.0')
