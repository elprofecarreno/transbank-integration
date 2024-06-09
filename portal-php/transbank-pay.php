<?php
    // CONSTANTE PARA DEFINIR MODO DEBUG
    define("DEBUG", "false");
    // CARGAR SESIÓN
    session_start();
    jsConsole("METODO: ", $_SERVER['REQUEST_METHOD']);

    // SE VERIFICA ENVIÓ DE FORMULARIO POR POST
    if (isset($_POST['btn-send'])) {
        $buyOrder = $_POST['buy-order'];
        $amount = $_POST['amount'];
        createTransactionTransbank($buyOrder, $amount);
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
    function createTransactionTransbank($buyOrder, $amount)
    {
        try {
            $serverIP = $_SERVER['SERVER_ADDR'];
            $serverPort = $_SERVER['SERVER_PORT'];
            jsConsole("server_ip: ".$serverIP);
            jsConsole("server_port: ".$serverPort);
            jsConsole("amount: ".$amount);
            $sessionId = rand(1000000, 9999999); /*CAMBIAR POR ID DEL USUARIO*/
            $returnUrl = "http://localhost:". $serverPort."/commit-pay.php"; /*PROGRAMAR PATH PARA RECIBIR DATOS POR POST*/
            jsConsole("session_id: ".$sessionId);
            jsConsole("return_url: ".$returnUrl);
            /*ARRAY QUE SERÁ TRANSFORMADO EN JSON*/
            $data = [
                "buy_order"=>$buyOrder,
                "session_id"=>$sessionId,
                "amount"=>$amount,
                "return_url"=>$returnUrl
            ];
            $url = 'https://webpay3gint.transbank.cl/rswebpaytransaction/api/webpay/v1.2/transactions';
            jsConsole("url: ".$url);
            // Datos para el encabezado
            $headers = [
                'Tbk-Api-Key-Id: 597055555532',
                'Tbk-Api-Key-Secret: 579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C',
                'Content-Type: application/json'
            ];
            // Convertir los datos a JSON
            $jsonData = json_encode($data);

            // Inicializar cURL
            $curl = curl_init();

            // Establecer la URL de destino
            curl_setopt($curl, CURLOPT_URL, $url);

            // Establecer la opción para indicar que se realizará una solicitud POST
            curl_setopt($curl, CURLOPT_POST, true);

            // Establecer los encabezados
            curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);

            // Establecer el cuerpo de la solicitud
            curl_setopt($curl, CURLOPT_POSTFIELDS, $jsonData);

            // Establecer la opción para devolver el resultado como cadena en lugar de imprimirlo directamente
            curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
            // 
            curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
            // Realizar la solicitud POST
            $response = curl_exec($curl);

            // Verificar si hubo algún error
            if (curl_errno($curl)) {
                echo 'Error: ' . curl_error($curl);
            }
            // Cerrar la conexión cURL
            curl_close($curl);
            jsConsole("response: ".$response);            
            // Decodificar la respuesta JSON en un arreglo asociativo
            $jsonResponse = json_decode($response, true);

            // Verificar si la decodificación fue exitosa
            if ($jsonResponse !== null) {
                // Acceder a los valores del JSON
                $token = $jsonResponse['token'];
                $url = $jsonResponse['url'];
                $_SESSION["token_tbk"]=$token;
                $_SESSION["url_tbk"]=$url;
                $_SESSION["amount"]=$amount;
                jsConsole("token_tbk: ".$_SESSION["token_tbk"]);
                jsConsole("url_tbk: ".$_SESSION["url_tbk"]);
                // Redirecciónamiento a sitio de envió de pago a transbank
                header("Location: send-pay.php");
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