from sklearn.preprocessing import StandardScaler
def get_predictions(pca_models:dict,data):
    key_list = ["url_length","domain_length","is_domain_ip","no_of_subdomain","no_of_letters_in_url","letter_ratio_in_url","no_of_digits_in_url",
    "digit_ratio_in_url","no_of_equal_in_url","no_of_question_mark_in_url","no_of_ampersand_in_url","no_of_other_special_char_in_url","special_char_symbol_ratio_in_url","has_https","has_title","favicon",
    "has_robots","iframe","has_external_form_submit","has_hidden_field","has_password_field","no_of_images","no_of_css","no_of_js","no_of_external_ref","is_domain_new"]
    values = [float(data[key]) for key in key_list]
    # data['result'] = model.predict([list(data.values())])
    results = {}
    for key,value in pca_models.items():
        scaler = value[2]
        X_new_scaled = scaler.transform([values])
        new_pca = (value[0].transform(X_new_scaled))
        results[key] = (int(value[1].predict(new_pca)[0]))
    # X_new_scaled = scaler.fit_transform([values])
    # new_pca = (pca_models[0].transform(X_new_scaled))
    # results['pca_n2'] = (int(pca_models[1].predict(new_pca)[0]))
    # X_new_scaled = scaler.fit_transform([values])
    # new_pca = (pca_models[2].transform(X_new_scaled))
    # results['pca_n2_cv'] = (int(pca_models[3].predict(new_pca)[0]))
    # X_new_scaled = scaler.fit_transform([values])
    # new_pca = (pca_models[4].transform(X_new_scaled))
    # results['pca_n3'] = (int(pca_models[5].predict(new_pca)[0]))
    # X_new_scaled = scaler.fit_transform([values])
    # new_pca = (pca_models[6].transform(X_new_scaled))
    # results['pca_n3_cv'] = (int(pca_models[7].predict(new_pca)[0]))
    return results

if(__name__=="__main__"):
    import joblib
    models = []
    models.append(joblib.load('test_flask/svm_model.pkl'))
    models.append(joblib.load('test_flask/svm_model_cross_vaalidated.pkl'))
    models.append(joblib.load('test_flask/svm_model_eq.pkl'))
    pca_models = {}
    pca_models["n2"] = [joblib.load('test_flask/pca_model.pkl'),joblib.load('test_flask/pca_svm_model.pkl'),joblib.load('test_flask/pca_scaler.pkl')]
    # pca_models["n2_cv"] = [joblib.load('test_flask/pca_model_n2_cv.pkl'),joblib.load('test_flask/pca_svm_model_n2_cv.pkl'),joblib.load('test_flask/pca_scaler_n2_cv.pkl')]
    pca_models["n3"] = [joblib.load('test_flask/pca_model_n3.pkl'),joblib.load('test_flask/pca_svm_model_n3.pkl'),joblib.load('test_flask/pca_scaler_n3.pkl')]
    # pca_models["n3_cv"] = [joblib.load('test_flask/pca_model_n3_cv.pkl'),joblib.load('test_flask/pca_svm_model_n3_cv.pkl'),joblib.load('test_flask/pca_scaler_n3_cv.pkl')]
    data_list = [
    [38.0, 29.0, 0.0, 2.0, 20.0, 0.526, 0.0, 0.0, 0.0, 0.0, 0.0, 2.0, 0.053, 1.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0], #phish
    [47.0, 14.0, 0.0, 1.0, 21.0, 0.447, 0.0, 0.0, 0.0, 0.0, 0.0, 3.0, 0.064, 1.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 0.0, 4.0, 0.0, 0.0, 247.0], #upwork
    [40.0, 10.0, 0.0, 1.0, 23.0, 0.575, 1.0, 0.025, 0.0, 0.0, 0.0, 2.0, 0.05, 1.0, 1.0, 1.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 22.0], #trello
    [62.0, 15.0, 0.0, 2.0, 26.0, 0.419, 18.0, 0.29, 0.0, 0.0, 0.0, 6.0, 0.097, 1.0, 1.0, 1.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 2.0, 0.0, 2.0], #chatgpt
    [32.0, 13.0, 0.0, 1.0, 16.0, 0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 2.0, 0.062, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 4.0, 0.0, 14.0], #openphish
    [82.0, 21.0, 0.0, 1.0, 34.0, 0.415, 17.0, 0.207, 0.0, 1.0, 0.0, 2.0, 0.037, 1.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 0.0, 5.0, 1.0, 0.0, 47.0], #sciencedirect
    [69.0, 19.0, 0.0, 3.0, 22.0, 0.319, 3.0, 0.043, 0.0, 0.0, 0.0, 6.0, 0.087, 1.0, 1.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 5.0, 0.0, 37.0], #archive.ics.ci.edu
    [24.0, 15.0, 0.0, 1.0, 15.0, 0.625, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.042, 1.0, 1.0, 1.0, 1.0, 3.0, 0.0, 0.0, 0.0, 76.0, 6.0, 0.0, 229.0], #youtube
    [25.0, 16.0, 0.0, 1.0, 16.0, 0.64, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.04, 1.0, 1.0, 1.0, 1.0, 1.0, 0.0, 0.0, 0.0, 28.0, 3.0, 0.0, 68.0], #facebook
    [46.0, 19.0, 0.0, 2.0, 22.0, 0.478, 0.0, 0.0, 0.0, 0.0, 0.0, 3.0, 0.065, 1.0, 1.0, 1.0, 0.0, 3.0, 0.0, 0.0, 0.0, 0.0, 2.0, 0.0, 16.0], #ngrok
    [32.0, 8.0, 0.0, 1.0, 17.0, 0.531, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.031, 1.0, 1.0, 1.0, 1.0, 0.0, 0.0, 0.0, 0.0, 124.0, 3.0, 0.0, 295.0], #pypi
    ]
    for data in data_list:
        print(get_predictions(models,pca_models,data))