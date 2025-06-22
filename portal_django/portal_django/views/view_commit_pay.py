from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpRequest
import traceback, requests, os
import datetime as dt

# MÉTODO QUE CREA LA CABECERA SOLICITADA POR TRANSBANK EN UN REQUEST (SOLICITUD)
def header_request_transbank():
    headers = { # DEFINICIÓN TIPO DE AUTORIZACIÓN Y AUTENTICACIÓN
                "Authorization": "Token",
                # LLAVE QUE DEBE SER MODIFICADA PORQUE ES SOLO DEL AMBIENTE DE INTEGRACIÓN DE TRANSBANK (PRUEBAS)
                "Tbk-Api-Key-Id": "597055555532",
                # LLAVE QUE DEBE SER MODIFICADA PORQUE DEL AMBIENTE DE INTEGRACIÓN DE TRANSBANK (PRUEBAS)
                "Tbk-Api-Key-Secret": "579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C",
                # DEFINICIÓN DEL TIPO DE INFORMACIÓN ENVIADA
                "Content-Type": "application/json",
                # DEFINICIÓN DE RECURSOS COMPARTIDOS ENTRE DISTINTOS SERVIDORES PARA CUALQUIER MÁQUINA
                "Access-Control-Allow-Origin": "*",
                'Referrer-Policy': 'origin-when-cross-origin',
                } 
    return headers

# PUT: Confirmar una transacción en Transbank
def transbank_commit(tokenws):
    print('tokenws: ', tokenws)
    url = f"https://webpay3gint.transbank.cl/rswebpaytransaction/api/webpay/v1.2/transactions/{tokenws}"
    print('url: ', url)
    headers = header_request_transbank()
    response = requests.put(url, headers=headers)
    print('response: ', response)
    return response

# POST: Reversar o anular una transacción en Transbank
def transbank_reverse_or_cancel(tokenws, amount):
    print('tokenws: ', tokenws)
    data = {
        "amount": amount
    }
    print('data: ', data)
    url = f"https://webpay3gint.transbank.cl/rswebpaytransaction/api/webpay/v1.2/transactions/{tokenws}/refunds"
    headers = header_request_transbank()
    response = requests.post(url, json=data, headers=headers)
    print('response: ', response.json())
    return response

@csrf_exempt
def commit_pay_view(request):
    transaction_detail = None
    try:
        print('commitpay')
        tokenws = request.GET.get('token_ws') or request.POST.get('token_ws')
        # TRANSACCIÓN REALIZADA
        if tokenws is not None:
            # APROBAR TRANSACCIÓN
            response = transbank_commit(tokenws)
            print(f'response.status_code: {response.status_code}')

            if response.status_code == 200:
                response = response.json()
                print(f'json: {response}')
                status = response.get('status')
                print("status: {0}".format(status))
                response_code = response.get('response_code')
                print("response_code: {0}".format(response_code))
                # TRANSACCIÓN APROBADA
                if status == 'AUTHORIZED' and response_code == 0:
                    state = 'ACEPTADO'
                    pay_type = ''
                    if response.get('payment_type_code') == 'VD':
                        pay_type = 'Tarjeta de Débito'
                    if response.get('payment_type_code') == 'VC':
                        pay_type = 'Tarjeta de Crédito'
                    amount = int(response.get('amount', 0))
                    amount = f'{amount:,.0f}'.replace(',', '.')
                    transaction_date = dt.datetime.strptime(response['transaction_date'], '%Y-%m-%dT%H:%M:%S.%fZ')
                    transaction_date = '{:%d-%m-%Y %H:%M:%S}'.format(transaction_date)
                    transaction_detail = {
                        'card_number': response['card_detail']['card_number'],
                        'transaction_date': transaction_date,
                        'state': state,
                        'pay_type': pay_type,
                        'amount': amount,
                        'authorization_code': response['authorization_code'],
                        'buy_order': response['buy_order'],
                    }
                else:
                    # TRANSACCIÓN RECHAZADA
                    state = 'RECHAZADO' if status == 'FAILED' else ''
                    pay_type = ''
                    if response.get('payment_type_code') == 'VD':
                        pay_type = 'Tarjeta de Débito'
                    if response.get('payment_type_code') == 'VC':
                        pay_type = 'Tarjeta de Crédito'
                    amount = int(response.get('amount', 0))
                    amount = f'{amount:,.0f}'.replace(',', '.')
                    response = transbank_reverse_or_cancel(tokenws=tokenws, amount=amount)
                    transaction_date = dt.datetime.strptime(response['transaction_date'], '%Y-%m-%dT%H:%M:%S.%fZ')
                    transaction_date = '{:%d-%m-%Y %H:%M:%S}'.format(transaction_date)
                    transaction_detail = {
                        'card_number': response['card_detail']['card_number'],
                        'transaction_date': transaction_date,
                        'state': state,
                        'pay_type': pay_type,
                        'amount': amount,
                        'authorization_code': response['authorization_code'],
                        'buy_order': response['buy_order'],
                    }
            else:
                return render(request, 'commit-pay.html', {'transaction_detail': None})
        return render(request, 'commit-pay.html', {'transaction_detail': transaction_detail})
    except Exception:
        traceback.print_exc()
        return render(request, 'commit-pay.html', {'transaction_detail': transaction_detail})