<?php
    $parametro1 = rand(1000, 9999999);
    $parametro2 = rand(1000, 9999999);
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
    <title>Transbank Pay</title>
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
    <div class="container-sm mt-4">
        <h4 class="my-4">TOTAL A PAGAR</h4>
        <form class="form-control" method="POST" action="transbank-pay.php">
            <div class="mb-3 row">
                <label for="buy-id" class="col-sm-2 col-form-label">BUY ID</label>
                <div class="col-sm-10">
                    <input type="text" readonly class="form-control-plaintext" id="buy-order" name="buy-order"
                        value="<?php echo $parametro2; ?>">
                </div>
            </div>
            <div class="mb-3 row">
                <label for="amount" class="col-sm-2 col-form-label">AMOUNT</label>
                <div class="col-sm-10">
                    <input type="text" class="form-control" id="amount" name="amount" value="<?php echo $parametro1; ?>">
                </div>
            </div>
            <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                <button id="btn-send" name="btn-send" class="btn btn-warning mx-4 my-4 col-2" type="submit"><img
                        src="assets/img/webpay-desktop-logo_color.svg" alt=""></button>
            </div>
        </form>
    </div>
</body>

</html>