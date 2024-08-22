from config.settings import common_tasks

def send_email(subject:str,message:str,to_list:list):
    common_tasks.send_email.delay(subject,message,to_list)