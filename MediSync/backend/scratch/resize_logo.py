from PIL import Image
import base64
import os

input_path = r"C:\Users\youss\Desktop\template 1\Template-Systeme-M-dicale\login\Logo_Medisync.png"
output_path = r"c:\Users\youss\Desktop\Django Project\MediSync\backend\static\images\Logo_Medisync_small.png"

if os.path.exists(input_path):
    img = Image.open(input_path)
    # Resize to 200px width, maintaining aspect ratio
    w_percent = (200 / float(img.size[0]))
    h_size = int((float(img.size[1]) * float(w_percent)))
    img = img.resize((200, h_size), Image.Resampling.LANCZOS)
    img.save(output_path, "PNG", optimize=True)
    
    with open(output_path, "rb") as f:
        encoded = base64.b64encode(f.read()).decode('utf-8')
        print(f"data:image/png;base64,{encoded}")
else:
    print("FILE_NOT_FOUND")
