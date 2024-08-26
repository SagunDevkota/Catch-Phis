from ..models import LegitDomain
from .predict import get_predictions
import urllib
import requests
import re

class Analyze:
    def __init__(self,data):
        self.data = data
        self.url_parser = urllib.parse.urlparse(data["url"])
        self.domain = self.url_parser.netloc.replace("www.","")
        self.scheme = self.url_parser.scheme
    
    def get_domain(self):
        return self.domain

    def __url_length(self):
        return len(self.data['url'])

    def __no_of_subdomain(self):
        if(str(self.domain).startswith("www.")):
            return len(self.domain[4:].split("."))-1
        return len(self.domain.split("."))-1
    
    def __no_of_digits_in_url(self):
        count = 0
        for _ in self.data['url']:
            if(_.isdigit()):
                count+=1
        return count
    
    def __digit_ratio_in_url(self):
        return format(self.__no_of_digits_in_url()/self.__url_length(),'.3f')
    
    def __no_of_equal_in_url(self):
        return self.data["url"].count("=")
    
    def __no_of_question_mark_in_url(self):
        return self.data["url"].count("?")
    
    def __no_of_ampersand_in_url(self):
        return self.data["url"].count("&")
    
    def __no_of_other_special_char_in_url(self):
        special_characters = ['!', '@', '#', '$', '%', '^', '*', '(', ')', '-', '_', '+', '`', '~', '[', ']', '{', '}', '|', '\\', ';', ':', "'", '"', ',', '.', '/', '<', '>', '?']
        count = 0
        url = self.data["url"][8:] if self.data["url"].startswith("https://") else self.data["url"][7:]
        domain = url[4:] if self.domain.startswith("www.") else url
        for char in domain:
            if char in special_characters and char not in ['=', '?', '&', '/']:
                count += 1
        return count
    
    def __special_char_symbol_ratio_in_url(self):
        return format((self.__no_of_equal_in_url()+self.__no_of_ampersand_in_url()+self.__no_of_other_special_char_in_url()+self.__no_of_question_mark_in_url())/self.__url_length(),'.3f')
    
    def __has_https(self):
        return 1 if "https" == self.url_parser.scheme else 0

    def __has_robots(self):
        url = self.scheme+"://"+self.domain+"/robots.txt"
        try:
            response = requests.get(url)
            if(response.status_code == 200):
                return 1
        except:
            pass
        return 0
        
    def __domain_title_match_score(self):
        # Remove 'https', 'http', 'www', and TLD from URL to get root domain
        title = self.data['title']
        domain = self.domain
        t_set = set(title.lower().split())
        txt_url = self.__root_domain(domain.lower())
        return self.__url_title_match_score_helper(t_set, txt_url)

    def __root_domain(self,url):
        return url

    def __url_title_match_score_helper(self,t_set, txt_url):
        score = 0
        base_score = 100 / len(txt_url)
        for element in t_set:
            if txt_url.find(element) >= 0:
                n = len(element)
                score += base_score * n
                txt_url = txt_url.replace(element, " ")
            if score > 99.9:
                score = 100
                break
        return score

    def __char_continuous_rate(self):
        text = self.domain.split(".")[:-1]
        text = ".".join(text)
        longest_alpha = max(re.findall(r'[a-zA-Z]+', text), key=len, default='')
        
        longest_digit = max(re.findall(r'\d+', text), key=len, default='')
        
        longest_special = max(re.findall(r'\W+', text), key=len, default='')
        
        return (len(longest_alpha)+len(longest_digit)+len(longest_special))/len(text)

    def result(self,predictions=False):
        similar = LegitDomain.search_similar(self.domain).first()
        self.data['no_of_subdomain'] = self.__no_of_subdomain()
        self.data['digit_ratio_in_url'] = self.__digit_ratio_in_url()
        self.data['special_char_symbol_ratio_in_url'] = self.__special_char_symbol_ratio_in_url()
        self.data['has_https'] = self.__has_https()
        self.data['has_robots'] = self.__has_robots()
        self.data['domain_title_match_score'] = self.__domain_title_match_score()
        self.data['url_similarity_index'] = similar.similarity if similar else 0
        self.data["char_continuous_rate"] = self.__char_continuous_rate()
        self.data["domain"] = self.domain
        if(get_predictions):
            self.data.update(get_predictions(self.data))
        return self.data
