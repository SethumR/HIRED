from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load the trained Keras model
model = tf.keras.models.load_model('/Users/sasindrisiriwardene/HIRED/Backend/my_model.keras')

@app.route('/predict', methods=['POST'])
def predict():
    # Expecting a JSON payload with a key "inputs" containing a list of embeddings.
    data = request.get_json()
    if not data or 'inputs' not in data:
        return jsonify({'error': 'Invalid input'}), 400

    # Convert input list to a numpy array
    inputs = np.array(data['inputs'])

    # Get predictions from the model
    predictions = model.predict(inputs)

    # Return predictions as JSON
    return jsonify({'predictions': predictions.tolist()})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
