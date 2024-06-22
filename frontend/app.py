from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import AutoModelForCausalLM, AutoTokenizer
import torch

app = Flask(__name__)
CORS(app)

# Load the model and tokenizer
tokenizer = AutoTokenizer.from_pretrained("facebook/opt-1.3b")
model = AutoModelForCausalLM.from_pretrained("facebook/opt-1.3b")

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    input_text = data.get("message", "")

    # Tokenize input and generate response
    inputs = tokenizer.encode(input_text, return_tensors="pt")
    outputs = model.generate(inputs, max_length=150, num_return_sequences=10)

    # Decode the response
    response_text = tokenizer.decode(outputs[0], skip_special_tokens=True)

    return jsonify({"response": response_text})

if __name__ == '__main__':
    app.run(debug=True)
