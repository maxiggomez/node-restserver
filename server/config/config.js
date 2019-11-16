//Puerto: SI no tiene valor le asigna 4500
process.env.PORT = process.env.PORT || 4500;

// Entorno -> Si no esta seteado devuelve dev
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// Base de datos
let urlDB;

if(process.env.NODE_ENV === 'dev'){
     urlDB = 'mongodb://localhost:27017/cafe'
}else{
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;