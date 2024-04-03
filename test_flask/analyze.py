import urllib
import requests
import whois
from datetime import datetime
import pandas as pd
import aiohttp
import asyncio

class Analyze:
    def __init__(self,data):
        self.data = data
        self.url_parser = urllib.parse.urlparse(data["url"])
        self.domain = self.url_parser.netloc
        self.valid = True
        try:
            self.whois_ = whois.whois(data['url'])
        except:
            self.valid = False

    async def get_response(self, url,headers=None):
        async with aiohttp.ClientSession() as session:
            async with session.get(url,headers=headers,ssl=False) as response:
                return await response.json()

    def contains_IP(self):
        parts = self.domain.split('.')
        if len(parts) == 4 and all(part.isdigit() for part in parts):
            return -1
        else:
            return 1
        
    def url_length(self):
        if(len(self.domain) > 75):
            return -1
        elif(len(self.domain) > 53):
            return 0
        else:
            return 1
        
    def is_shortened(self):
        origin_url = self.data['origin_url']
        url = self.data['url']
        if url != origin_url:
            if(".".join(urllib.parse.urlparse(origin_url).netloc.split(".")[-2:]) == ".".join(urllib.parse.urlparse(url).netloc.split(".")[-2:])):
                return 1
            else:
                return -1
        return 1
    
    def url_contains_at_symbol(self):
        if("@" in self.data['url']):
            return -1
        else:
            return 1
        
    def url_contains_db_slash(self):
        return 1 if len(self.data['url'].split("//"))==2 else -1
        
    def url_contains_hyphen(self):
        return -1 if "-" in self.domain else 1
    
    def sub_domain_count(self):
        count = (self.domain.count(".")-1)
        if (count>2):
            return -1
        elif (count>1):
            return 0
        else:
            return 1
        
    def contains_https(self):
        return 1 if "https" == self.url_parser.scheme else -1
    
    def get_domain_age(self):
        creation_date = self.whois_.creation_date[0] if type(self.whois_.creation_date)==list else self.whois_.creation_date
        return 1 if (datetime.now() - creation_date).days>365 else -1
    
    def get_domain_registration_length(self):
        updated_date = self.whois_.updated_date[0] if type(self.whois_.updated_date)==list else self.whois_.updated_date
        expiration_date = self.whois_.expiration_date[0] if type(self.whois_.expiration_date)==list else self.whois_.expiration_date
        try:
            return 1 if (expiration_date - updated_date).days>365 else -1
        except TypeError:
            return -1
    
    def has_favicon(self):
        if(self.data["favicon"] is None):
            return -1
        return 1
    
    def anchor_url(self):
        anchor = self.data['anchor_url']
        try:
            if(anchor>=.31 and anchor<=.67):
                return 0
            if(anchor<.31):
                return 1
        except TypeError:
            return -1
        return -1
    
    def request_url(self):
        anchor = self.data['request_url']
        try:
            if(anchor>=.22 and anchor<=.61):
                return 0
            if(anchor<.22):
                return 1
        except TypeError:
            return -1
        return -1
    
    def redirects(self):
        if(self.data['redirects']<=1):
            return 1
        if(self.data['redirects']>=4):
            return -1
        return 0

    def meta_script_link(self):
        meta_script_link = self.data['meta_script_link']
        try:
            if(meta_script_link>=.17 and meta_script_link<=.81):
                return 0
            if(meta_script_link<.17):
                return 1
        except TypeError:
            return -1
        return -1
    
    def get_port(self):
        if isinstance((self.url_parser.port),type(None)):
            return 1
        return -1 if self.url_parser.port in [443,80,8080] else -1
    
    def is_abnormal_url(self):
        domain_name = self.whois_.domain_name[0] if type(self.whois_.domain_name) == list else self.whois_.domain_name
        return 1 if(domain_name.lower() in self.data['url'].lower()) else -1
    
    def is_valid_dns_record_present(self):
        return 1 if self.valid else -1
    
    def get_host(self):
        df = pd.read_csv("test_flask/domain_type.csv")
        chunks = self.domain.split(".")[::-1]
        url = ""
        previous_type = None
        for chunk in chunks:
            data = df[df["Domain"] == chunk]
            if(len(data) == 0):
                return chunk+url
            data = data.iloc[0]
            if(data["Type"] == previous_type):
                return chunk+url
            url = "."+chunk+url
            previous_type = data["Type"]
        return url
    
    async def check_global_ranking(self):
        async with aiohttp.ClientSession() as session:
            async with session.get(f"https://api.similarweb.com/v1/similar-rank/{self.get_host()}/rank?api_key=7965dc2a27124af187e632ced8539bcf", ssl=False) as response:
                if response.status == 200:
                    response_json = await response.json()
                    rank = response_json['similar_rank']["rank"]
                    if rank < 100000:
                        return 1
                    else:
                        return 0
                else:
                    return -1
        
    async def check_backlinks(self):
        response = await self.get_response("https://app.neilpatel.com/api/get_token?debug=app_norecaptcha")
        token = response['token']
        headers = {
            "Authorization": f"Bearer {token}"
        }
        response = await self.get_response(f"https://app.neilpatel.com/api/backlinks_overview?domain={self.get_host()}&mode=domain",headers=headers)
        backlinks = response["backlinks"]
        if backlinks > 2:
            return 1
        elif backlinks < 1:
            return -1
        else:
            return 0
        
    async def result(self):
        self.data['contains_IP'] = self.contains_IP()
        self.data['url_length'] = self.url_length()
        self.data['is_shortened'] = self.is_shortened()
        self.data['url_contains_at_symbol'] = self.url_contains_at_symbol()
        self.data['url_contains_db_slash'] = self.url_contains_db_slash()
        self.data['url_contains_hyphen'] = self.url_contains_hyphen()
        self.data['sub_domain_count'] = self.sub_domain_count()
        self.data['contains_https'] = self.contains_https()
        self.data['get_domain_age'] = self.get_domain_age()
        self.data['get_domain_registration_length'] = self.get_domain_registration_length()
        self.data['favicon'] = self.has_favicon()
        self.data["anchor_url"] = self.anchor_url()
        self.data["request_url"] = self.request_url()
        self.data['redirects'] = self.redirects()
        self.data["meta_script_link"] = self.meta_script_link()
        self.data['get_port'] = self.get_port()
        self.data['is_abnormal_url'] = self.is_abnormal_url()
        self.data['is_valid_dns_record_present'] = self.is_valid_dns_record_present()
        self.data['check_global_ranking'] = await self.check_global_ranking()
        self.data['check_backlinks'] = await self.check_backlinks()
        return self.data
        
# analyze = Analyze({
#     "anchor_url" : 0.2,
#     "favicon" : "https://ssl.gstatic.com/colaboratory-static/common/a01fcfa49b15ed5edf590b766bd247d1/img/favicon.ico",
#     "iframe" : -1,
#     "mail_to" : 1,
#     "on_mouse_over" : 1,
#     "redirects" : 1,
#     "request_url" : 0,
#     "server_form_handler" : 1,
#     "url" : "https://colab.research.google.com/drive/1DrlPkDg2iEt_rwOLADCNhCe854UjVZ6u#scrollTo=dga-OQmr45VG",
#     "origin_url": "https://grabify.link/NV8X47"
# })
# print(analyze.result())

# async def main():
#     now = datetime.now()
#     data = {
#         "anchor_url" : 0.2,
#         "favicon" : "https://ssl.gstatic.com/colaboratory-static/common/a01fcfa49b15ed5edf590b766bd247d1/img/favicon.ico",
#         "iframe" : -1,
#         "mail_to" : 1,
#         "on_mouse_over" : 1,
#         "redirects" : 1,
#         "request_url" : 0,
#         "server_form_handler" : 1,
#         "url" : "https://colab.research.google.com/drive/1DrlPkDg2iEt_rwOLADCNhCe854UjVZ6u#scrollTo=dga-OQmr45VG",
#         "origin_url": "https://grabify.link/NV8X47"
#     }
#     analyze_instance = Analyze(data)   
#     print(await analyze_instance.result())
#     print(datetime.now()-now)

# asyncio.run(main())