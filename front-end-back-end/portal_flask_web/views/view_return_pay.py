# IMPORT FLASK LIB
from flask import render_template
# IMPORT FLASK LIB REQUEST OBJECT
from flask import request
# IMPORT LIBRERIES ERROR TRACE, OPERATION SYSTEM AND REQUEST CLIENT API REST
import traceback, requests

def app_return_pay_view(app):

    @app.route('/commit-pay', methods=['GET'])
    def commit_pay_view():
        print('METHOD', request.method)
        token_ws = request.args.get('token_ws')
        return render_template('commit-pay.html', token_ws=token_ws)
