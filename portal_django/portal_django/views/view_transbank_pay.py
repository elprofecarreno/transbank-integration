from django.shortcuts import render, redirect
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
import os
import requests
from urllib.parse import urlparse

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

# DEFINICIÓN DE RUTA API REST, PERMITIENDO SOLO SER LLAMADO POR POST
def transbank_create(data):
    # LECTURA DE PAYLOAD (BODY) CON INFORMACIÓN DE TIPO JSON
    print('transbank_create: ')
    print('data: ', data)
    # DEFINICIÓN DE URL DE TRANSBANK PARA CREAR UNA TRANSACCIÓN
    url = "https://webpay3gint.transbank.cl/rswebpaytransaction/api/webpay/v1.2/transactions"
    # CABECERA SOLICITADA POR TRANSBANK
    headers = header_request_transbank()
    # INVOCACIÓN POR POST A API REST QUE CREA UNA TRANSACCIÓN EN TRANSBANK
    response = requests.post(url, json = data, headers=headers)
    print('response: ', response.json())
    # RETORNO DE LA RESPUESTA DE TRANSBANK
    return response

@csrf_exempt
def transbank_pay_view(request):
    API_REST_HOST = os.getenv('API_REST_HOST')
    API_REST_PORT = os.getenv('API_REST_PORT')

    if request.method == 'GET':
        buy_order = '10029393040405'
        amount = 250000
        context = {
            'buy_order': buy_order,
            'amount': amount
        }
        return render(request, 'transbank-pay.html', context)

    elif request.method == 'POST':
        # Obtener el host y el puerto
        domain = urlparse(request.build_absolute_uri())
        host = 'localhost'
        port = 8000

        buy_order = request.POST.get('buy-order')
        session_id = 12345786  # SESSION ID USER
        amount = request.POST.get('amount')
        return_url = f'http://{host}:{port}/commit-pay'

        body = {
            "buy_order": buy_order,
            "session_id": session_id,
            "amount": amount,
            "return_url": return_url
        }

        response = transbank_create(body)
        print('json_response: ', response)
        if response.status_code == 200:
            context = {
                'amount': amount,
                'transbank': response.json()
            }
            return render(request, 'send-pay.html', context)
        else:
            return render(request, 'error.html', {'error': 'ERROR TRANSBANK CREATE TRANSACTION'})