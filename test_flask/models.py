from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class PhishingWebsite(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    contains_IP = db.Column(db.Integer)
    url_length = db.Column(db.Integer)
    is_shortened = db.Column(db.Integer)
    url_contains_at_symbol = db.Column(db.Integer)
    url_contains_db_slash = db.Column(db.Integer)
    url_contains_hyphen = db.Column(db.Integer)
    sub_domain_count = db.Column(db.Integer)
    contains_https = db.Column(db.Integer)
    get_domain_registration_length = db.Column(db.Integer)
    favicon = db.Column(db.Integer)
    get_port = db.Column(db.Integer)
    request_url = db.Column(db.Integer)
    anchor_url = db.Column(db.Integer)
    meta_script_link = db.Column(db.Integer)
    server_form_handler = db.Column(db.Integer)
    is_abnormal_url = db.Column(db.Integer)
    redirects = db.Column(db.Integer)
    on_mouse_over = db.Column(db.Integer)
    iframe = db.Column(db.Integer)
    get_domain_age = db.Column(db.Integer)
    is_valid_dns_record_present = db.Column(db.Integer)
    check_global_ranking = db.Column(db.Integer)
    check_backlinks = db.Column(db.Integer)
    result = db.Column(db.Integer)
    url = db.Column(db.String(255))
    def __repr__(self):
        return f'<PhishingWebsite id={self.id}, result={self.result}>'