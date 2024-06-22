from config.settings import common_tasks

def send_email(subject:str,message:str,to_list:list):
    print("send_email called")
    common_tasks.send_email.delay(subject,message,to_list)