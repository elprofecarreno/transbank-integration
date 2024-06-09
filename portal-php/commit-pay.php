<?php
        // CONSTANTE PARA DEFINIR MODO DEBUG
        define("DEBUG", "true");
        // CARGAR SESIÓN
        session_start();
        ?>  

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DETAIL PAY</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz"
        crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/umd/popper.min.js"
        integrity="sha384-I7E8VVD/ismYTF4hNIPjVp/Zjvgyol6VFvRkX/vR+Vc4jQkC+hVqc2pM8ODewa9r"
        crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.min.js"
        integrity="sha384-0pUGZvbkm6XF6gxjEnlmuGrJXVbNuzT9qBBavbLwCsOGabYfZo0T0to5eqruptLy"
        crossorigin="anonymous"></script>
</head>
   
<body>
    <div class="container-sm m-auto my-5 centrar">
   
        
    <?php

        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            $tokenWs = $_GET['token_ws'];
            commitTransactionTransbank($tokenWs);
        }

    // FUNCIÓN PARA IMPRIMIR INFORMACIÓN EN LA CONSOLA DE JAVASCRIPT
    function jsConsole($message)
    {
        try {
            if (DEBUG == "true") {
                echo "<script>console.log('".$message."'); </script>";
            }
        } catch (Exception $e) {
            echo " ";
        }

    }
    // FUNCIÓN PARA CREAR UNA TRANSACCIÓN CON LA API DE TRANSBANK
    function commitTransactionTransbank($tokenWs)
    {
        try {
            jsConsole("tokenWs: ".$tokenWs);
            $url = 'https://webpay3gint.transbank.cl/rswebpaytransaction/api/webpay/v1.2/transactions/'.$tokenWs;
            jsConsole("url: ".$url);
            // Datos para el encabezado
            $headers = [
                'Tbk-Api-Key-Id: 597055555532',
                'Tbk-Api-Key-Secret: 579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C',
                'Content-Type: application/json'
            ];

            // Inicializar cURL
            $curl = curl_init();

            // Establecer la URL de destino
            curl_setopt($curl, CURLOPT_URL, $url);

            // Establecer la opción para indicar que se realizará una solicitud POST
            curl_setopt($curl, CURLOPT_PUT, true);

            // Establecer los encabezados
            curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);

            // Establecer la opción para devolver el resultado como cadena en lugar de imprimirlo directamente
            curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);

            // Realizar la solicitud POST
            $response = curl_exec($curl);

            // Verificar si hubo algún error
            if (curl_errno($curl)) {
                echo 'Error: ' . curl_error($curl);
            }
            // Cerrar la conexión cURL
            curl_close($curl);
            // Decodificar la respuesta JSON en un arreglo asociativo
            $jsonResponse = json_decode($response, true);

            // Verificar si la decodificación fue exitosa
            if ($jsonResponse !== null) {
                $status = $jsonResponse['status'];
                $monto = $jsonResponse['amount'];
                /* TRANSACCIÓN AUTORIZADA */
                if ($status === "AUTHORIZED" || $status === "FAILED") {
                    if ($status === "AUTHORIZED") {
                        $titulo = "<h2 class='my-2'>DETALLE DEL PAGO</h2>";
                    } else {
                        $titulo =  "<h2 class='my-2'>ERROR PAGO RECHAZADO</h2>";
                    }

                    $tipoTarjeta = "";
                    /*
                        VD = Venta con débito.
                        BV = Venta normal.
                        VC = Venta en cuotas.
                        YES = 3 cuotas sin interés.
                        S2 = 2 cuotas sin interés.
                        NC = N cuotas sin interés.
                        PV = Venta prepaga.
                    */
                    if($jsonResponse['payment_type_code'] === 'VD'){
                        $tipoTarjeta = "Débito";
                    }else if($jsonResponse['payment_type_code'] === 'BV' || $jsonResponse['payment_type_code'] === 'VC' 
                            || $jsonResponse['payment_type_code'] === 'YES' || $jsonResponse['payment_type_code'] === 'S2'
                            || $jsonResponse['payment_type_code'] === 'NC'){
                                $tipoTarjeta = "Crédito";
                    }else if($jsonResponse['payment_type_code'] === 'PV'){
                        $tipoTarjeta = "Débito Prepago";
                    }
                    $dataHTML =
                        '<div class="row m-5 m-auto">'.
                        '<div class="col-12">'.
                        '    <h3 class="${colorTextTitulo} border-bottom border-primary">'.$titulo.'</h3>'.
                        '    <img src="assets/img/webpay-desktop-logo_color.svg">'.
                        '</div>'.
                        '<div class="col-12 m-2">'.
                        '    <span class="${colorText}">TARJETA:</span> XXXX-XXXX-XXXX-'.$jsonResponse['card_detail']['card_number'].
                        '</div>'.
                        '<div class="col-12 m-2">'.
                        '    <span class="${colorText}">TIPO TARJETA:</span>  '.$tipoTarjeta.
                        '</div>'.
                        '<div class="col-12 m-2">'.
                        '    <span class="${colorText}">FECHA:</span> '.$jsonResponse['transaction_date'].
                        '</div>'.
                        '<div class="col-12 m-2">'.
                        '    <span class="${colorText}">ORDEN DE COMPRA:</span>  '.$jsonResponse['buy_order'].
                        '</div>'.
                        '<div class="col-12 m-2">'.
                        '    <span class="${colorText}">SESSION:</span> '.$jsonResponse['session_id'].
                        '</div>'.
                        '<div class="col-12 m-2">'.
                        '    <span class="${colorText}">MONTO:</span> '.$monto.
                        '</div>'.
                        '<div class="col-12 m-2">'.
                        '    <span class="${colorText}">ESTADO:</span> '.$status.
                        '</div>'.
                    '</div>';
                    echo $dataHTML;
                }
                ?>
                    <br>
                    <div>
                    <a href="index.php"><button class="btn btn-primary" style="width: 30%;">Salir</button></a>
                   
                    </div><?php 
                exit;
            } else {
                // Manejar el caso de que la decodificación falle
                jsConsole('Error al decodificar la respuesta JSON');
            }
        } catch (Exception $e) {
            jsConsole('Caught exception: ');
        }
           }
    ?>    
    </div>
   
    
</body>

</html>