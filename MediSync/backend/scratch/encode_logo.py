import base64
import os

path = r"C:\Users\youss\Desktop\template 1\Template-Systeme-M-dicale\login\Logo_Medisync.png"
if os.path.exists(path):
    with open(path, "rb") as image_file:
        encoded_string = base64.b64encode(image_file.read()).decode('utf-8')
        print(f"data:image/png;base64,{encoded_string}")
else:
    print("FILE_NOT_FOUND")
