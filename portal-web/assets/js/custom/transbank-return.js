/*  FUNCIÓN JQUERY QUE SE EJECUTA AL MOMENTO DE CARGAR EL DOM */
/*  SE REALIZA MANEJO DE REDIRECCIONAMIENTO DESDE TRANSBANK SOBRE EL SITIO http://127.0.0.1:5500/portal-web/commit-pay.html (FRONTEND)
    OBTENIENDO LOS DATOS  ENVIADOS POR ESTE, PARA POSTERIORMENTE CONFIRMAR LA TRANSACCIÓN */
$(document).ready(function () {
    console.log('LEER PARAMETRO ENVIADO DESDE TRANSBANK');
    tokenws = new URLSearchParams(window.location.search).get('token_ws');
    console.log('tokenws: ', tokenws);
    commit(tokenws);

});

/* FUNCIÓN QUE PERMITE CONFIRMAR TRANSACCIÓN CON TRANSBANK */
function commit(tokenws){
    /* LLAMADO A API REST COMMIT TRANSACCIÓN TRANSBANK */
    const resp = fetch(`http://127.0.0.1:8900/api/v1/transbank/transaction/commit/${tokenws}`, {
        method: 'PUT',
        /* SE HABILITA VERIFICACIÓN DE SITIO CRUZADO */
        mode: "cors",
        /* DEFINICIÓN CABECERA */
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        }
    })
    .then((response) => {
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
        console.log('objJSON: ', objJSON);
        /* TRANSFORMANDO JSON OBTENIDO EN REGISTROS QUE SE MOSTRARÁN EN LA PÁGINA WEB.*/
        const status = objJSON.status;
        const monto = objJSON.amount;
        /* TRANSACCIÓN AUTORIZADA */
        if(status === "AUTHORIZED" || status === "FAILED"){
            let titulo = "";
            let colorTextTitulo = "";
            let colorText = "";
            if(status === "AUTHORIZED"){
                titulo = "DETALLE DEL PAGO";
                colorText = "text-info";
                colorTextTitulo = "bg-info text-white";
            }else{
                titulo = "ERROR PAGO RECHAZADO.";
                colorText = "text-danger";
                colorTextTitulo = "bg-danger text-white";
            }
            const ordenCompra = objJSON.buy_order;
            const tarjeta = objJSON.card_detail.card_number;
            let tipoTarjeta = "";    
            /*
                VD = Venta con débito.
                BV = Venta normal.
                VC = Venta en cuotas.
                YES = 3 cuotas sin interés.
                S2 = 2 cuotas sin interés.
                NC = N cuotas sin interés.
                PV = Venta prepaga.
            */
            if(objJSON.payment_type_code === 'VD'){
                tipoTarjeta = "Débito";
            }else if(objJSON.payment_type_code === 'BV' || objJSON.payment_type_code === 'VC' 
                    || objJSON.payment_type_code === 'YES' || objJSON.payment_type_code === 'S2'
                    || objJSON.payment_type_code === 'NC'){
                tipoTarjeta = "Crédito";
            }else if(objJSON.payment_type_code === 'PV'){
                tipoTarjeta = "Débito Prepago";
                reversOrCancel(tokenws, monto);
                /* BREAKPOINT SE DEJA DE EJECUTAR MÉTODO*/
                return
            }
            const session =  objJSON.session_id;
            const fecha = objJSON.transaction_date;
    
            dataHTML =  `<div class="row m-5 m-auto">
                            <div class="col-12">
                                <h3 class="${colorTextTitulo} border-bottom border-primary">${titulo}</h3> 
                                <img src="assets/img/webpay-desktop-logo_color.svg">
                            </div>        
                            <div class="col-12 m-2">
                                <span class="${colorText}">TARJETA:</span> XXXX-XXXX-XXXX-${tarjeta}
                            </div>
                            <div class="col-12 m-2">
                                <span class="${colorText}">TIPO TARJETA:</span>  ${tipoTarjeta}
                            </div> 
                            <div class="col-12 m-2">
                                <span class="${colorText}">FECHA:</span>  ${fecha}
                            </div>
                            <div class="col-12 m-2">
                                <span class="${colorText}">ORDEN DE COMPRA:</span>  ${ordenCompra}
                            </div>
                            <div class="col-12 m-2">
                                <span class="${colorText}">SESSION:</span>  ${session}
                            </div>                        
                            <div class="col-12 m-2">
                                <span class="${colorText}">MONTO:</span>  ${monto}
                            </div>
                            <div class="col-12 m-2">
                                <span class="${colorText}">ESTADO:</span>  ${status}
                            </div>                                                    
                        </div>`;
            $('#voucher').append(dataHTML);                 
        } else{
            /* SE DEBE VOLVER ATRÁS O CANCELAR LA TRANSACCIÓN */ 
            reversOrCancel(tokenws, monto);
        }
    }).catch((err) => {
        /* SECCIÓN PARA CAPTURAR ERRORES */
        console.log('ERROR: ', err.message);
    });
}

/* FUNCIÓN QUE PERMITE REVERSAR O CANCELAR TRANSACCIÓN CON TRANSBANK */
function reversOrCancel(tokenws, amount){
    /* LLAMADO A API REST REVERSE OR CANCEL TRANSACCIÓN TRANSBANK */
    const resp = fetch(`http://127.0.0.1:8900/api/v1/transbank/transaction/reverse-or-cancel/${tokenws}`, {
        method: 'POST',
        /* SE HABILITA VERIFICACIÓN DE SITIO CRUZADO */
        mode: "cors",
        /* DEFINICIÓN CABECERA */
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        /* DEFINICIÓN DEL CUERPO (PAYLOAD)*/
        body: JSON.stringify({
            amount: amount
        })
    })
    .then((response) => {
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
        console.log('objJSON: ', objJSON);
        /* TRANSFORMANDO JSON OBTENIDO EN REGISTROS QUE SE MOSTRARÁN EN LA PÁGINA WEB.*/
        const tipo = objJSON.type;
        const codigoAutorizacion = objJSON.authorization_code;
        const fechaAutorizacion = objJSON.authorization_date;
        const montoAnulado = objJSON.nullified_amount;
        const balance = objJSON.balance;
        const codigo = objJSON.response_code;

        dataHTML =  `<div class="row m-5 m-auto">
                        <div class="col-12">
                            <h3 class="text-info border-bottom border-primary">ERROR EN EL PAGO. TRANSACCIÓN CANCELADA.</h3> 
                            <img src="assets/img/webpay-desktop-logo_color.svg">
                        </div>        
                        <div class="col-12 m-2">
                            <span class="text-info">TIPO:</span> XXXX-XXXX-XXXX-${tipo}
                        </div>
                        <div class="col-12 m-2">
                            <span class="text-info">CODIGO AUTORIZACIÓN:</span>  ${codigoAutorizacion}
                        </div> 
                        <div class="col-12 m-2">
                            <span class="text-info">FECHA AUTORIZACIÓN:</span>  ${fechaAutorizacion}
                        </div>
                        <div class="col-12 m-2">
                            <span class="text-info">MONTO ANULADO:</span>  ${montoAnulado}
                        </div>
                        <div class="col-12 m-2">
                            <span class="text-info">MONTO PENDIENTE:</span>  ${balance}
                        </div>                        
                        <div class="col-12 m-2">
                            <span class="text-info">CÓDIGO RESPUESTA:</span>  ${codigo}
                        </div>                        
                    </div>`;
        $('#voucher').append(dataHTML);
    }).catch((err) => {
        /* SECCIÓN PARA CAPTURAR ERRORES */
        console.log('ERROR: ', err.message);
    });
}

