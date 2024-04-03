from flask import Flask,request,jsonify
from flask_cors import CORS
from keras.models import load_model
from analyze import Analyze
import asyncio
from models import db, PhishingWebsite
from predict import get_predictions

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'

# Load the model
model = load_model('test_flask/model_varing_training_after_filter.h5')

db.init_app(app)
CORS(app)

@app.route("/",methods=['post'])
def report():
    if request.is_json:
        data = request.get_json()
        analyze = Analyze(data)
        loop = asyncio.new_event_loop()
        result = loop.run_until_complete(analyze.result())
        loop.close()
        result.pop("origin_url")
        result.pop("mail_to")
        result['result'] = get_predictions(model,result)
        # new_phishing = PhishingWebsite(**result)
        # db.session.add(new_phishing)
        # db.session.commit()
        return jsonify(result)
    else:
        return 'Request must contain JSON data', 400

if(__name__ == "__main__"):
    with app.app_context():
        db.create_all()
    app.run('0.0.0.0',8000,True)