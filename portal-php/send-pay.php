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
    <title>Send Pay</title>
</head>
<body>
    <form id='send_pay_form' method='POST' action='<?php echo $_SESSION["url_tbk"] ?>'>
        <input type='hidden' name='token_ws' value='<?php echo $_SESSION["token_tbk"] ?>'>
        <input type='hidden' name='amount' value='<?php echo $_SESSION["amount"] ?>'>
    </form>
    <script type="text/javascript">
        function delay(milliseconds){
            return new Promise(resolve => {
                setTimeout(resolve, milliseconds);
            });
        }
        delay(500);
        document.getElementById('send_pay_form').submit();
    </script>
</body>
</html>