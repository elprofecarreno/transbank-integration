const express = require('express');
const axios = require('axios');
const app = express();
const helmet = require('helmet');
const path = require('path');

app.set('view engine', 'ejs');
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
      styleSrc: ["'self'", "https://cdn.jsdelivr.net"],
      imgSrc: ["'self'", "data:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'", "https://cdn.jsdelivr.net"],
      objectSrc: ["'none'"],
      formAction: ["'self'", "https://webpay3gint.transbank.cl"], // Permite enviar formularios a Transbank
    }
  }
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
  res.redirect('/transbankpay');
});

const transbank = require('./src/routes/transbankpay');
app.use('/', transbank);

// 6. EJS + Layouts
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));

app.listen(3000, () => {
  console.log('Servidor en http://localhost:3000');
});


