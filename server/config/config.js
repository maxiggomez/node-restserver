//Puerto: SI no tiene valor le asigna 4500
process.env.PORT = process.env.PORT || 4500;

// Entorno -> Si no esta seteado devuelve dev
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


// Vencimineto Token
// 60 segundos
// 60 mimnutos
// 24 horas
// 30 días
process.env.CADUCIDAD_TOKEN = '48h';

// Seed de autenticación
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

// Base de datos
let urlDB;

if(process.env.NODE_ENV === 'dev'){
     urlDB = 'mongodb://localhost:27017/cafe'
}else{
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

// Google client id
process.env.CLIENT_ID = process.env.CLIENT_ID || '1096487095067-psfdf9c4q0vc32vm890qs8t9h1mgqrbd.apps.googleusercontent.com';