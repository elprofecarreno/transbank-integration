# IMPORT FLASK LIB
from flask import render_template
# IMPORT FLASK LIB REQUEST OBJECT
from flask import request
# IMPORT LIBRERIES ERROR TRACE, OPERATION SYSTEM AND REQUEST CLIENT API REST
import traceback, requests, os
# IMPORT LIBRERY DATETIME
import datetime as dt

def app_return_pay_view(app):

    @app.route('/commit-pay', methods=['GET', 'POST'])
    def commit_pay_view():
        try: 
            print('commitpay')
            if request.method == 'GET':
                tokenws = request.args.get('token_ws')
            elif request. method == 'POST':
                tokenws = request.args.get('token_ws')
            #TRANSACCIÓN REALIZADA
            if tokenws is not None:
                #APROBAR TRANSACCIÓN
                host = os.getenv('API_REST_HOST')
                port = os.getenv('API_REST_PORT')            
                url = 'http://{0}:{1}/api/v1/transbank/transaction/commit/{2}'.format(host, port, tokenws)
                print('url: ', url)
                response = requests.put(url)            
                print(f'response.status_code: {response.status_code}')

                if response.status_code == 200:

                    response = response.json()
                    print(f'json: {response}')
                    status = response['status']
                    print("status: {0}".format(status))
                    response_code = response['response_code']
                    print("response_code: {0}".format(response_code)) 
                    #TRANSACCIÓN APROBADA
                    if status == 'AUTHORIZED' and response_code == 0:
                        state = ''
                        if status == 'AUTHORIZED':
                            state = 'ACEPTADO'
                        pay_type = ''
                        if response['payment_type_code'] == 'VD':
                            pay_type = 'Tarjeta de Débito'
                        if response['payment_type_code'] == 'VC':
                            pay_type = 'Tarjeta de Crédito'
                        amount = int(response['amount'])
                        amount = f'{amount:,.0f}'.replace(',', '.')
                        transaction_date = dt.datetime.strptime(response['transaction_date'], '%Y-%m-%dT%H:%M:%S.%fZ')
                        transaction_date = '{:%d-%m-%Y %H:%M:%S}'.format(transaction_date)
                        transaction_detail = {  'card_number': response['card_detail']['card_number'],
                                                'transaction_date': transaction_date,
                                                'state': state,
                                                'pay_type': pay_type,
                                                'amount': amount,
                                                'authorization_code': response['authorization_code'],
                                                'buy_order': response['buy_order'], }
                    else:
                        #TRANSACCIÓN RECHAZADA
                        state = ''
                        if status == 'FAILED':
                            state = 'RECHAZADO'            
                        if response['payment_type_code'] == 'VD':
                            pay_type = 'Tarjeta de Débito'
                        if response['payment_type_code'] == 'VC':
                            pay_type = 'Tarjeta de Crédito'            
                        amount = int(response['amount'])
                        amount = f'{amount:,.0f}'.replace(',', '.')
                        #response = transbank_reverse_or_cancel(tokenws=tokenws, amount=amount)
                        print(f'response: {response}')
                        transaction_date = dt.datetime.strptime(response['transaction_date'], '%Y-%m-%dT%H:%M:%S.%fZ')
                        transaction_date = '{:%d-%m-%Y %H:%M:%S}'.format(transaction_date)
                        transaction_detail = {  'card_number': response['card_detail']['card_number'],
                                                'transaction_date': transaction_date,
                                                'state': state,
                                                'pay_type': pay_type,
                                                'amount': amount,
                                                'authorization_code': response['authorization_code'],
                                                'buy_order': response['buy_order'], }
                else: 
                    return render_template('commit-pay.html', transaction_detail=None)
                return render_template('commit-pay.html', transaction_detail=transaction_detail)
        except Exception:
            traceback.print_exc()
            return render_template('commit-pay.html', transaction_detail=transaction_detail)