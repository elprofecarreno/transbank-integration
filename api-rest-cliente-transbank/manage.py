# IMPORTACIÓN LIBRERIAS FLASK PARA GENERACIÓN DE API
from flask import Flask, request, jsonify
# IMPORTACIÓN DE LIBRERIA FLASK PARA DEFINIR POLITICAS DE ACCESO Y COMPARTICIÓN DE RECURSO REMOTOS AL SERVICIO
from flask_cors import CORS
# LIBRERÍA PARA CREAR CLIENTES API REST Y CONSUMIR APIS DE TERCEROS
import requests
# LIBRERÍA PARA SERIALIZAR OBJETOS JSON
#import json

app = Flask(__name__)
CORS(app)
# SE HABILITA ACCESO PARA API DESDE EL ORIGEN http://127.0.0.1:5500 (PÁGINA WEB EN HTML + JAVASCRIPT [FRONT END])
cors = CORS(app, resource={
    # RUTA O RUTAS HABILTADAS PARA EL ORIGEN http://127.0.0.1:5500
    r"/api/v1/transbank/*":{
        "origins":"http://127.0.0.1:5500"
    }
})

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
@app.route('/api/v1/transbank/transaction/create', methods=['POST'])
def transbank_create():
    # LECTURA DE PAYLOAD (BODY) CON INFORMACIÓN DE TIPO JSON
    print('headers: ', request.headers)
    data = request.json
    print('data: ', data)
    # DEFINICIÓN DE URL DE TRANSBANK PARA CREAR UNA TRANSACCIÓN
    url = "https://webpay3gint.transbank.cl/rswebpaytransaction/api/webpay/v1.2/transactions"
    # CABECERA SOLICITADA POR TRANSBANK
    headers = header_request_transbank()
    # INVOCACIÓN POR POST A API REST QUE CREA UNA TRANSACCIÓN EN TRANSBANK
    response = requests.post(url, json = data, headers=headers)
    print('response: ', response.json())
    # RETORNO DE LA RESPUESTA DE TRANSBANK
    return response.json()

# DEFINICIÓN DE RUTA API REST CON UN PARAMETRO DE ENTRADA (tokenws) EN EL PATH, PERMITIENDO SOLO SER LLAMADO POR GET
@app.route('/api/v1/transbank/transaction/commit/<string:tokenws>', methods=['PUT'])
def transbank_commit(tokenws):
    print('tokenws: ', tokenws)
    # DEFINICIÓN DE URL DE TRANSBANK PARA CONFIRMAR UNA TRANSACCIÓN
    url = "https://webpay3gint.transbank.cl/rswebpaytransaction/api/webpay/v1.2/transactions/{0}".format(tokenws)
    # CABECERA SOLICITADA POR TRANSBANK
    headers = header_request_transbank()
    # INVOCACIÓN POR GET A API REST QUE CONFIRMA UNA TRANSACCIÓN EN TRANSBANK    
    response = requests.put(url, headers=headers)
    print('response: ', response.json())
    # RETORNO DE LA RESPUESTA DE TRANSBANK
    return response.json()

# DEFINICIÓN DE RUTA API REST CON UN PARAMETRO DE ENTRADA (tokenws, amount) EN EL PATH, PERMITIENDO SOLO SER LLAMADO POR POST
@app.route('/api/v1/transbank/transaction/reverse-or-cancel/<string:tokenws>', methods=['POST'])
def transbank_reverse_or_cancel(tokenws):
    print('tokenws: ', tokenws)
    # LECTURA DE PAYLOAD (BODY) CON INFORMACIÓN DE TIPO JSON
    data = request.json
    print('data: ', data)
    # DEFINICIÓN DE URL DE TRANSBANK PARA CONFIRMAR UNA TRANSACCIÓN
    url = "https://webpay3gint.transbank.cl/rswebpaytransaction/api/webpay/v1.2/transactions/{0}/refunds".format(tokenws)
    # CABECERA SOLICITADA POR TRANSBANK
    headers = header_request_transbank()
    # INVOCACIÓN POR GET A API REST QUE CONFIRMA UNA TRANSACCIÓN EN TRANSBANK    
    response = requests.post(url, json = data, headers=headers)
    print('response: ', response.json())
    # RETORNO DE LA RESPUESTA DE TRANSBANK
    return response.json()       
 
# DESPLIEGUE SERVICIO PROPIO DE FLASK (SOLO PARA PRUEBAS). EN DONDE AL DEFINI 0.0.0.0 SE 
# HABILITA EL USO DE LA IP LOCAL, IP DE RED, ETC. PARA EL PUERTO 8900
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8900, debug=True)