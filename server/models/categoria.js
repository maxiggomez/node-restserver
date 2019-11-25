const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


let Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    descripcion:{
        type: String,
        required:[true,'El nombre es necesario']
    },
    usuario:{
        type: String,
        required:[true,'El usuario es necesario']
    }
});

module.exports = mongoose.model('categoria',categoriaSchema);