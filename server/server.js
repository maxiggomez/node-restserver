require('./config/config.js');

const express = require('express');
const app = express();

// Importamos las rutas para que al levantar este archivo sepa como tomar las peticiones http.
app.use( require('./routes/usuario'));

const mongoose = require('mongoose');


/*
const bodyParse = require('body-parser');
app.use(bodyParse.urlencoded({extended:false}));
app.use(bodyParse.json());
*/

mongoose.connect(process.env.URLDB ,
    { useNewUrlParser: true, useCreateIndex: true},
    (err,res)=>{
    if(err) throw err;

    console.log('Conectado a DB');

});

app.listen(process.env.PORT,function(){
    console.log('Escuchando en el puerto:',process.env.port);
});