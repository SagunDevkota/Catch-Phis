from flask import Flask,request,jsonify
from flask_cors import CORS
import joblib
from analyze import Analyze
from trie import Trie
from models import db, PhishingWebsite
from predict import get_predictions

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'

# Load the model
pipelines = {}
pipelines['svc_pca'] = joblib.load('models/exports/full_pipeline_svc_model.joblib')
pipelines['xgboost_pca'] = joblib.load('models/exports/full_pipeline_xgboost.joblib')

trie = Trie()
# trie = trie.load_trie("test_flask/models/exports/trie_data.json")

db.init_app(app)
CORS(app)

@app.route("/",methods=['post'])
def report():
    if request.is_json:
        data = request.get_json()
        analyze = Analyze(data)
        result = analyze.result(trie)
        entry = PhishingWebsite.query.filter_by(domain=result['domain']).first()
        if not entry:
            prediction_result = get_predictions(pipelines,result)
            result.update(prediction_result)
            # data_store = result.copy()
            # data_store["svc_pca"] = result["svc_pca"]
            # data_store["xgboost_pca"] = result["xgboost_pca"]
            # del data_store["result"]
            # data_store["domain"] = result["domain"]
            new_phishing = PhishingWebsite(**result)
            db.session.add(new_phishing)
            db.session.commit()
            return jsonify(result)
        else:
            print(entry)
            return jsonify(entry.to_dict())
    else:
        return 'Request must contain JSON data', 400

if(__name__ == "__main__"):
    with app.app_context():
        print("creating")
        db.create_all()
    app.run('0.0.0.0',8000,True)