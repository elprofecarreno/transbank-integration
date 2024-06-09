# IMPORT FLASK LIB
from flask import Flask
# IMPORT LIB OPERATION SYSTEM
import os
# IMPORT LOAD ENVIRONMENT (.env)
from dotenv import load_dotenv
# LOAD ENVIRONMENT
load_dotenv()
# IMPORT VIEWS
from views.view_transbank_pay import app_transbank_pay_view
from views.view_return_pay import app_return_pay_view
# LOAD PATH PARENTS FOLDER
BASE_DIR = os.path.abspath(os.getcwd())
print('BASE_DIR: ', BASE_DIR)

# CREATE PATH TEMPLATES FOLDER
TEMPLATE_FOLDER = os.path.join(BASE_DIR, 'templates')
print('TEMPLATE_FOLDER: ', TEMPLATE_FOLDER)

# LOAD TEMPLATES
STATIC_FOLDER = os.path.join(BASE_DIR, 'static')
print('STATIC_FOLDER: ', STATIC_FOLDER)

# CREATE FLASK APP WEB
app = Flask(__name__, template_folder=TEMPLATE_FOLDER, static_folder=STATIC_FOLDER)

# LOAD VIEW
app_transbank_pay_view(app)
app_return_pay_view(app)

if __name__ == '__main__':
    app.run(host=os.getenv('APP_WEB_HOST'), port=os.getenv('APP_WEB_PORT'), debug=True)

