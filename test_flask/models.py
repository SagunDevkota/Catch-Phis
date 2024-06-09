from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class PhishingWebsite(db.Model):
    __tablename__ = 'phishing_website'

    id = db.Column(db.Integer, primary_key=True)
    url = db.Column(db.String, nullable=False)
    favicon = db.Column(db.Integer, nullable=False)
    has_title = db.Column(db.Integer, nullable=False)
    title = db.Column(db.String, nullable=False)
    has_copyright_info = db.Column(db.Integer, nullable=False)
    has_social_media_links = db.Column(db.Integer, nullable=False)
    has_description = db.Column(db.Integer, nullable=False)
    has_external_form_submit = db.Column(db.Integer, nullable=False)
    iframe = db.Column(db.Integer, nullable=False)
    has_hidden_field = db.Column(db.Integer, nullable=False)
    has_password_field = db.Column(db.Integer, nullable=False)
    no_of_images = db.Column(db.Integer, nullable=False)
    no_of_css = db.Column(db.Integer, nullable=False)
    no_of_js = db.Column(db.Integer, nullable=False)
    no_of_self_ref = db.Column(db.Integer, nullable=False)
    url_length = db.Column(db.Integer, nullable=False)
    domain_length = db.Column(db.Integer, nullable=False)
    is_domain_ip = db.Column(db.Integer, nullable=False)
    no_of_subdomain = db.Column(db.Integer, nullable=False)
    no_of_letters_in_url = db.Column(db.Integer, nullable=False)
    letter_ratio_in_url = db.Column(db.Float, nullable=False)
    no_of_digits_in_url = db.Column(db.Integer, nullable=False)
    digit_ratio_in_url = db.Column(db.Float, nullable=False)
    no_of_equal_in_url = db.Column(db.Integer, nullable=False)
    no_of_question_mark_in_url = db.Column(db.Integer, nullable=False)
    no_of_ampersand_in_url = db.Column(db.Integer, nullable=False)
    no_of_other_special_char_in_url = db.Column(db.Integer, nullable=False)
    special_char_symbol_ratio_in_url = db.Column(db.Float, nullable=False)
    has_https = db.Column(db.Integer, nullable=False)
    has_robots = db.Column(db.Integer, nullable=False)
    domain_title_match_score = db.Column(db.Float, nullable=False)
    url_similarity_index = db.Column(db.Integer, nullable=False)
    char_continuous_rate = db.Column(db.Float, nullable=False)
    domain = db.Column(db.String, nullable=False)
    # empty_external_to_total = db.Column(db.Float, nullable=False)
    svc_pca = db.Column(db.Integer, nullable=False)
    xgboost_pca = db.Column(db.Integer, nullable=False)

    def to_dict(self):
        return {column.name: getattr(self, column.name) for column in self.__table__.columns}