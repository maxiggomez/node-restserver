const express = require('express');
const app = express();

// Importamos las rutas para que al levantar este archivo sepa como tomar las peticiones http.
app.use( require('./usuario'));
app.use( require('./login'));
app.use( require('./categoria'));
app.use( require('./producto'));
app.use( require('./upload'));
app.use( require('./imagenes'));

module.exports = app;