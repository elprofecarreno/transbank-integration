# IMPORT FLASK LIB
from flask import render_template
# IMPORT FLASK LIB REQUEST OBJECT
from flask import request
# IMPORT LIBRARIES ERROR TRACE, OPERATION SYSTEM AND REQUEST CLIENT API REST
import traceback, os, requests
# IMPORT LIBRARY URL DOMAIN
from urllib.parse import urlparse

def app_transbank_pay_view(app):

    API_REST_HOST = os.getenv('API_REST_HOST')
    API_REST_PORT = os.getenv('API_REST_PORT')

    @app.route('/transbank-pay', methods=['GET', 'POST'])
    def transbank_pay_view():
        print('METHOD', request.method)

        if request.method == 'GET':
            buy_order = '10029393040405'
            amount = 250000
            context = {
                'buy_order': buy_order,
                'amount': amount
            }
            return render_template('transbank-pay.html', context=context)
        elif  request.method == 'POST':

            domain = urlparse(request.base_url)
            host = domain.hostname
            port = domain.port

            buy_order = request.form.get('buy-order')
            session_id = 12345786 # SESSION ID USER
            amount = request.form.get('amount')
            return_url = 'http://{0}:{1}/commit-pay'.format(host, port)

            body = {
                "buy_order": buy_order,
                "session_id": session_id,
                "amount": amount,
                "return_url": return_url
                }
            host = os.getenv('API_REST_HOST')
            port = os.getenv('API_REST_PORT')
                             
            url = 'http://{0}:{1}/api/v1/transbank/transaction/create'.format(host, port)
            print('url: ', url)
            response = requests.post(url, json=body)
            json_response = response.json()
            print('json_response: ', json_response)
            if response.status_code == 200 :
                context = {
                    'amount': amount,
                    'transbank' : json_response
                }
                return render_template('send-pay.html', context=context)
            else: 
                return render_template('ERROR TRANSBANK CREATE TRANSACTION')
