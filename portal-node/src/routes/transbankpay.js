const express = require('express');
const router = express.Router();
const axios = require('axios');

// Cabecera solicitada por Transbank
const headers = {
    "Authorization": "Token",
    "Tbk-Api-Key-Id": "597055555532",
    "Tbk-Api-Key-Secret": "579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C",
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Referrer-Policy": "origin-when-cross-origin"
};

// Mostrar formulario
router.get('/transbankpay', (req, res) => {
    res.render('transbankpay', { monto: 35000, });
});

// Procesar pago
router.post('/sendpay', async (req, res) => {
    const { monto } = req.body;

    // Payload de ejemplo (ajusta según lo que requiere Transbank)
    const data = {
        amount: Number(monto),
        // Agrega aquí los demás campos requeridos por la API de Transbank
        // e.g. buy_order, session_id, return_url, etc.
        buy_order: "orden123",
        session_id: "sesion123",
        return_url: "http://localhost:3000/commitpay"
    };

    console.log('data:', data);
    response = null;
    try {
        console.log('CREATE TRANSACTION');
        response = await axios.post(
            "https://webpay3gint.transbank.cl/rswebpaytransaction/api/webpay/v1.2/transactions",
            data,
            { headers }
        );
        console.log('response: ', response.data);
        // Puedes mostrar el resultado o redirigir según la respuesta de Transbank
        //res.json(response.data);
    } catch (error) {
        console.error(error.response ? error.response.data : error.message);
        res.status(500).send('Error al procesar el pago con Transbank');
    }

    // Aquí puedes agregar la lógica para procesar el pago
    res.render('sendpay', {
        transbank: {
            url: response.data.url,      // URL de pago entregada por Transbank
            token: response.data.token   // Token entregado por Transbank
        },
        amount: monto                 // El monto a pagar
    });
});

router.get('/commitpay', async (req, res) => {
    try {

        console.log('COMMIT PAY');

        // 1. Obtener token_ws desde GET o POST
        const tokenws = req.method === 'GET' ? req.query.token_ws : req.body.token_ws;

        if (!tokenws) {
            return res.render('commitpay', { transaction_detail: null });
        }

        console.log(`tokenws: ${tokenws}`);

        // 2. Llamar a tu API interna para obtener el estado de la transacción
        const host = process.env.API_REST_HOST || 'localhost';
        const port = process.env.API_REST_PORT || '8000';
        const url = `https://webpay3gint.transbank.cl/rswebpaytransaction/api/webpay/v1.2/transactions/${tokenws}`;

        let response;
        try {
            console.log(`url: ${url}`);
            response = await axios.put(url, null, { headers });
        } catch (error) {
            console.error('Error al llamar a la API interna:', error.response ? error.response.data : error.message);
            return res.render('commitpay', { transaction_detail: null });
        }

        if (response.status === 200) {
            const data = response.data;
            let state = '';
            if (data.status === 'AUTHORIZED') state = 'ACEPTADO';
            if (data.status === 'FAILED') state = 'RECHAZADO';

            let pay_type = '';
            if (data.payment_type_code === 'VD') pay_type = 'Tarjeta de Débito';
            if (data.payment_type_code === 'VC') pay_type = 'Tarjeta de Crédito';

            // Formatear monto
            const amount = Number(data.amount).toLocaleString('es-CL');

            // Formatear fecha
            let transaction_date = data.transaction_date;
            try {
                const dateObj = new Date(transaction_date);
                transaction_date = dateObj.toLocaleString('es-CL');
            } catch (e) { }

            const transaction_detail = {
                card_number: data.card_detail.card_number,
                transaction_date,
                state,
                pay_type,
                amount,
                authorization_code: data.authorization_code,
                buy_order: data.buy_order,
            };

            return res.render('commitpay', { transaction_detail });
        } else {
            return res.render('commitpay', { transaction_detail: null });
        }
    } catch (err) {
        console.error(err);
        return res.render('commitpay', { transaction_detail: null });
    }
});


module.exports = router;