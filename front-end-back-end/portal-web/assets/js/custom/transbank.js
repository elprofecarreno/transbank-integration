async function create(){
    console.log('FUNCIÓN DE PAGO');
    const ordenCompra = "123456789"
    const sessionId = "1233DSXXD"
    /* LEER MONTO A PAGAR */
    const monto = $("#txt-amount").val();
    const urlRetornoPago = "http://127.0.0.1:5500/portal-web/commit-pay.html"
    const url = "http://127.0.0.1:8900/api/v1/transbank/transaction/create";
    const method = 'POST';
    /* LLAMADO A API REST CREACIÓN TRANSACCIÓN TRANSBANK */
    console.log('CALL SERVICE: ', url);
    const resp = await fetch(url, {
        method: method,
        /* SE HABILITA VERIFICACIÓN DE SITIO CRUZADO */
        mode: "cors",
        /* DEFINICIÓN CABECERA */
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        /* DEFINICIÓN DEL CUERPO (PAYLOAD)*/
        body: JSON.stringify({
            buy_order: ordenCompra,
            session_id: sessionId,
            amount: monto,
            return_url: urlRetornoPago
        }),
    }).then((response) => {
        /* SECCIÓN PARA VERIFICAR LA RESPUESTA */
        if (response.ok) {
            console.log('RESPUESTA CORRECTA.');
            /* RETORNANDO JSON EN FORMATO TEXTO EN VARIABLE (data) QUE USA EL SIGUIENTE BLOQUE THEN*/
            return response.text();
        } else {
            console.log('ERROR EN LA RESPUESTA DE TRANSBANK');
            /* EN CASO DE ERROR SE PROPAGA Y ES CAPTURADO POR EL BLOQUE CATCH*/
            throw new Exception('ERROR EN LA RESPUESTA DE TRANSBANK');
        }
    }).then((data) => {
        /* SECCIÓN PARA LEER data.json */
        console.log('TRASFORMANDO de texto a JSON');
        const objJSON = JSON.parse(data);
        console.log('json: ', objJSON);
        const url = objJSON.url;
        const token = objJSON.token;
        console.log('url: ', url);
        console.log('token: ', token);
        /* CREAR FORMULARIO PARA ENVIAR DATOS POR POST A TRANSBANK */
        var form = document.createElement("form");
        form.method = "POST";
        form.action = url;
        form.hidden = true;
        /* CREANDO INPUT Y NOMBRE DE DATO A ENVIAR*/
        var element1 = document.createElement("input");
        element1.hidden = true;
        element1.value = token;
        element1.name = 'token_ws';
        form.appendChild(element1);
        /* AGREGANDO FORMULARIO AL HTML*/
        document.body.appendChild(form);
        /* ENVIANDO FORMULARIO A TRANSBANK */
        form.submit();
    }).catch((err) => {
        /* SECCIÓN PARA CAPTURAR ERRORES */
        console.log('ERROR: ', err.message);
    });
}

