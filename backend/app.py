from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from pymongo import MongoClient
from datetime import datetime
import pickle
import os
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from io import BytesIO
from bson import ObjectId

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# MongoDB Configuration
mongo_uri = os.getenv('MONGO_URI', 'mongodb+srv://predictwelluser:Rajesh123$@predictwellcluster.dhsvaqt.mongodb.net/predictwell?retryWrites=true&w=majority&appName=PredictWellCluster')
print("Connecting to MongoDB with URI:", mongo_uri)
try:
    client = MongoClient(mongo_uri)
    client.server_info()
    print("Successfully connected to MongoDB Atlas!")
    db = client['predictwell']
    predictions_collection = db['predictions']
    contacts_collection = db['contacts']
except Exception as e:
    print("Failed to connect to MongoDB Atlas:", str(e))
    raise e

# Load ML Model
model_path = os.path.join('model', 'diabetes_model.pkl')
with open(model_path, 'rb') as file:
    model = pickle.load(file)

@app.route('/api/predict', methods=['POST'])
def predict():
    try:
        print("Received predict request:", request.get_json())
        data = request.get_json()
        input_data = [
            float(data['pregnancies']),
            float(data['glucose']),
            float(data['bloodPressure']),
            float(data['skinThickness']),
            float(data['insulin']),
            float(data['bmi']),
            float(data['diabetesPedigree']),
            float(data['age'])
        ]
        prediction = model.predict([input_data])[0]
        result = 'High Risk' if prediction == 1 else 'Low Risk'

        prediction_record = {
            'input': data,
            'result': result,
            'timestamp': datetime.utcnow()
        }
        predictions_collection.insert_one(prediction_record)

        response = {'result': result, 'id': str(prediction_record['_id'])}
        print("Sending response:", response)
        return jsonify(response)
    except (KeyError, ValueError) as e:
        print("Error in predict:", str(e))
        return jsonify({'error': 'Invalid input data. All fields must be numbers.'}), 400
    except Exception as e:
        print("Unexpected error in predict:", str(e))
        return jsonify({'error': str(e)}), 500

@app.route('/api/history', methods=['GET'])
def get_history():
    predictions = list(predictions_collection.find().sort('timestamp', -1))
    for pred in predictions:
        pred['_id'] = str(pred['_id'])
    return jsonify(predictions)

@app.route('/api/history/<id>', methods=['DELETE'])
def delete_prediction(id):
    predictions_collection.delete_one({'_id': ObjectId(id)})
    return jsonify({'message': 'Prediction deleted'})

@app.route('/api/contact', methods=['POST'])
def contact():
    data = request.get_json()
    contact_record = {
        'name': data['name'],
        'email': data['email'],
        'message': data['message'],
        'timestamp': datetime.utcnow()
    }
    contacts_collection.insert_one(contact_record)
    return jsonify({'message': 'Message sent successfully'})

@app.route('/api/report/<id>', methods=['GET'])
def generate_report(id):
    prediction = predictions_collection.find_one({'_id': ObjectId(id)})
    if not prediction:
        return jsonify({'error': 'Prediction not found'}), 404

    buffer = BytesIO()
    pdf = canvas.Canvas(buffer, pagesize=letter)
    pdf.setTitle('PredictWell Diabetes Prediction Report')
    pdf.drawString(100, 750, 'PredictWell: Diabetes Prediction Report')
    pdf.drawString(100, 730, f"Date: {prediction['timestamp'].strftime('%Y-%m-%d %H:%M:%S')}")
    pdf.drawString(100, 710, f"Result: {prediction['result']}")
    pdf.drawString(100, 690, 'Input Parameters:')
    for key, value in prediction['input'].items():
        pdf.drawString(120, 670 - 20 * list(prediction['input'].keys()).index(key), f"{key}: {value}")
    pdf.showPage()
    pdf.save()
    buffer.seek(0)
    return send_file(buffer, as_attachment=True, download_name='prediction_report.pdf')

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)