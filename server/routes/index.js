const express = require('express');
const app = express();

// Importamos las rutas para que al levantar este archivo sepa como tomar las peticiones http.
app.use( require('./usuario'));
app.use( require('./login'));

module.exports = app;