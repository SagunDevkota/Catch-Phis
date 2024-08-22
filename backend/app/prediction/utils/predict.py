from django.conf import settings
import pandas as pd

def get_predictions(data):
    models = settings.MODELS
    key_list = ['has_social_media_links','has_copyright_info','has_description',
                'url_similarity_index','domain_title_match_score','has_https',
                'has_external_form_submit','has_hidden_field','favicon',
                'special_char_symbol_ratio_in_url','digit_ratio_in_url',
                'has_title',
                'char_continuous_rate','has_robots','no_of_js','no_of_self_ref',
                'no_of_subdomain']
    new_names = [
        'HasSocialNet', 'HasCopyrightInfo', 'HasDescription',
        'score', 'DomainTitleMatchScore', 'IsHTTPS', 'HasSubmitButton',
        'HasHiddenFields', 'HasFavicon', 'SpacialCharRatioInURL',
        'DegitRatioInURL', 'HasTitle', 'CharContinuationRate', 'Robots',
        'NoOfJS', 'NoOfSelfRef', 'NoOfSubDomain'
    ]
    values = {key: float(data[key]) for key in key_list}
    values_df = pd.DataFrame([values])
    values_df.rename(columns=dict(zip(key_list, new_names)), inplace=True)
    results = {}
    for key,value in models.items():
        results[key] = int(value.predict(values_df)[0])
    return results