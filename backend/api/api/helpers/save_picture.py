import os
from uuid import uuid4
from PIL import Image
from pathlib import Path
from imgurpython import ImgurClient

# the backend needs to save the images in the frontend static folder
BASE_DIR = Path(__file__).parents[4].resolve()
print(BASE_DIR)
static = f"{BASE_DIR}/frontend/topUp/static"

# # set imgur client
# client_id = os.getenv("IMGUR_CLIENT_ID", "NOT_SET")
# client_secret = os.getenv("IMGUR_CLIENT_SECRET", "NOT_SET")
# imgur_client = ImgurClient(client_id, client_secret)

def save_picture(file, folderName: str = '',
                 fileName: str = None):
    randon_uid = str(uuid4())
    _, f_ext = os.path.splitext(file.filename)

    picture_name = (randon_uid if fileName == None else fileName.lower().replace(
        ' ', '') + randon_uid) + f_ext

    path = os.path.join(static, folderName)
    if not os.path.exists(path):
        os.makedirs(path)

    picture_path = os.path.join(path, picture_name)

    output_size = (1200, 1200)
    img = Image.open(file.file)

    img.thumbnail(output_size)
    img.save(picture_path)

    """the returned path will be used as an imageUrl by the frontend when 
    it tries to access the images and since the images will be stored in the 
    frontend static folder itself, we can just return the path relative to frontend
    but if imgur is being used then the path of uploaded image can be returned
    """

    # if os.getenv("USE_IMGUR_FOR_IMAGE_STORAGE", default="False").lower() in ['true', 'yes', '1', 'on']:
    #     uploaded_image = imgur_client.upload_from_path(picture_path)
    #     return uploaded_image['link']
    # else:
    #     return f'static/{folderName}/{picture_name}'

    return f'{static}/{folderName}/{picture_name}'

