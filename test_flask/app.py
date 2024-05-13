from flask import Flask,request,jsonify
from flask_cors import CORS
import joblib
from analyze import Analyze
import asyncio
# from models import db, PhishingWebsite
from predict import get_predictions

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'

# Load the model
pca_models = {}
pca_models["n2"] = [joblib.load('test_flask/models/using/pca_model_dc.pkl'),joblib.load('test_flask/models/using/pca_svm_model_dc.pkl'),joblib.load('test_flask/models/using/pca_scaler_dc.pkl')]
pca_models["n3"] = [joblib.load('test_flask/models/using/pca_model_n3_dc.pkl'),joblib.load('test_flask/models/using/pca_svm_model_n3_dc.pkl'),joblib.load('test_flask/models/using/pca_scaler_n3_dc.pkl')]

# db.init_app(app)
CORS(app)

@app.route("/",methods=['post'])
def report():
    if request.is_json:
        data = request.get_json()
        analyze = Analyze(data)
        result = analyze.result()
        result['result'] = get_predictions(pca_models,result)
        # new_phishing = PhishingWebsite(**result)
        # db.session.add(new_phishing)
        # db.session.commit()
        print(result['result'])
        return jsonify(result)
    else:
        return 'Request must contain JSON data', 400

if(__name__ == "__main__"):
    # with app.app_context():
    #     db.create_all()
    app.run('0.0.0.0',8000,True)