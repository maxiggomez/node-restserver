require('./config/config.js');

const express = require('express');
const app = express();


const mongoose = require('mongoose');

// Configuración de Rutas
app.use(require('./routes/index'));


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