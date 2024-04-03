import pandas as pd
import urllib
def get_host(url):
    url_parser = urllib.parse.urlparse(url)
    domain = url_parser.netloc
    df = pd.read_csv("test_flask/domain_type.csv")
    chunks = domain.split(".")[::-1]
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

print(get_host("https://access-ppl-com-medmellak899232585.codeanyapp.com/ok/Spotify/Issued/settings/"))