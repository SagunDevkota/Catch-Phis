import numpy as np
def get_predictions(model,data):
    key_list = ['contains_IP', 'url_length', 'is_shortened',
        'url_contains_at_symbol', 'url_contains_db_slash', 'url_contains_hyphen',
        'sub_domain_count', 'contains_https', 'get_domain_registration_length',
        'favicon', 'get_port', 'request_url', 'anchor_url', 'meta_script_link',
        'server_form_handler', 'is_abnormal_url', 'redirects', 'on_mouse_over', 'iframe',
        'get_domain_age', 'check_global_ranking', 'check_backlinks']

    values = [data[key] for key in key_list]
    input_data = np.array([values])
    print(values)
    # Predict using the model
    predictions = model.predict(input_data)
    print(predictions)
    probabilities = np.exp(predictions) / np.sum(np.exp(predictions), axis=1, keepdims=True)
    print(probabilities)
