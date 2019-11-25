require('./config/config.js');

const express = require('express');
const app = express();


const mongoose = require('mongoose');
const path  = require('path');
// Configuración de Rutas
app.use(require('./routes/index'));


/*
const bodyParse = require('body-parser');
app.use(bodyParse.urlencoded({extended:false}));
app.use(bodyParse.json());
*/

// Habilitar la carpeta Public
app.use( express.static( path.resolve(__dirname,'../public') ));

mongoose.connect(process.env.URLDB ,
    { useNewUrlParser: true, useCreateIndex: true},
    (err,res)=>{
    if(err) throw err;

    console.log('Conectado a DB');

});

app.listen(process.env.PORT,function(){
    console.log('Escuchando en el puerto:',process.env.port);
});