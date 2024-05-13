import urllib
import requests
import whois
import datetime

# todo:
# no_of_letters_in_url
# no_of_other_special_char_in_url
# no of external ref

# ask
# Is no of css and js inclusive of <style> and <script> tag within the doc

# from extension
# url
# has_title
# 

class Analyze:
    def __init__(self,data):
        self.data = data
        self.url_parser = urllib.parse.urlparse(data["url"])
        self.domain = self.url_parser.netloc.replace("www.","")
        self.scheme = self.url_parser.scheme
        self.whois_data = whois.whois(self.domain)
        # self.valid = True
        # try:
        #     self.whois_ = whois.whois(data['url'])
        # except:
        #     self.valid = False

    def url_length(self):
        return len(self.data['url'])
    
    def domain_length(self):
        return len(self.domain)
    
    def is_domain_ip(self):
        parts = self.domain.split('.')
        if len(parts) == 4 and all(part.isdigit() for part in parts):
            return 1
        else:
            return 0

    def no_of_subdomain(self):
        if(str(self.domain).startswith("www.")):
            return len(self.domain[4:].split("."))-1
        return len(self.domain.split("."))-1
    
    def no_of_letters_in_url(self):
        unique_chars = set(self.data['url'])
        return len(unique_chars)

    def letter_ratio_in_url(self):
        return format(self.no_of_letters_in_url()/self.url_length(),'.3f')
    
    def no_of_digits_in_url(self):
        count = 0
        for _ in self.data['url']:
            if(_.isdigit()):
                count+=1
        return count
    
    def digit_ratio_in_url(self):
        return format(self.no_of_digits_in_url()/self.url_length(),'.3f')
    
    def no_of_equal_in_url(self):
        return self.data["url"].count("=")
    
    def no_of_question_mark_in_url(self):
        return self.data["url"].count("?")
    
    def no_of_ampersand_in_url(self):
        return self.data["url"].count("&")
    
    def no_of_other_special_char_in_url(self):
        special_characters = ['!', '@', '#', '$', '%', '^', '*', '(', ')', '-', '_', '+', '`', '~', '[', ']', '{', '}', '|', '\\', ';', ':', "'", '"', ',', '.', '/', '<', '>', '?']
        count = 0
        url = self.data["url"][8:] if self.data["url"].startswith("https://") else self.data["url"][7:]
        domain = url[4:] if self.domain.startswith("www.") else url
        for char in domain:
            if char in special_characters and char not in ['=', '?', '&', '/']:
                count += 1
        return count
    
    def special_char_symbol_ratio_in_url(self):
        return format((self.no_of_equal_in_url()+self.no_of_ampersand_in_url()+self.no_of_other_special_char_in_url()+self.no_of_question_mark_in_url())/self.url_length(),'.3f')
    
    def has_https(self):
        return 1 if "https" == self.url_parser.scheme else 0

    def has_robots(self):
        url = self.scheme+"://"+self.domain+"/robots.txt"
        try:
            response = requests.get(url)
            if(response.status_code == 200):
                return 1
        except:
            pass
        return 0
    
    def is_domain_new(self):
        creation_date = self.whois_data.creation_date[0] if type(self.whois_data.creation_date)==list else self.whois_data.creation_date
        if(creation_date):
            print(False if (datetime.datetime.now() - creation_date).days>90 else True)
            return False if (datetime.datetime.now() - creation_date).days>90 else True
        else:
            return True
        
    def result(self):
        self.data['url_length'] = self.url_length()
        self.data['domain_length'] = self.domain_length()
        self.data['is_domain_ip'] = self.is_domain_ip()
        self.data['no_of_subdomain'] = self.no_of_subdomain()
        self.data['no_of_letters_in_url'] = self.no_of_letters_in_url()
        self.data['letter_ratio_in_url'] = self.letter_ratio_in_url()
        self.data['no_of_digits_in_url'] = self.no_of_digits_in_url()
        self.data['digit_ratio_in_url'] = self.digit_ratio_in_url()
        self.data['no_of_equal_in_url'] = self.no_of_equal_in_url()
        self.data['no_of_question_mark_in_url'] = self.no_of_question_mark_in_url()
        self.data['no_of_ampersand_in_url'] = self.no_of_ampersand_in_url()
        self.data['no_of_other_special_char_in_url'] = self.no_of_other_special_char_in_url()
        self.data['special_char_symbol_ratio_in_url'] = self.special_char_symbol_ratio_in_url()
        self.data['has_https'] = self.has_https()
        # self.data['has_favicon'] = self.has_favicon()
        self.data['has_robots'] = self.has_robots()
        self.data['is_domain_new'] = self.is_domain_new()
        return self.data
