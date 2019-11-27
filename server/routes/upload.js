const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

// Importo esquema de BD
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

const fs = require('fs');
const path = require('path');

app.use( fileUpload({ useTempFiles: true }) ); // Es el middleware de express-fileupload

app.put('/upload/:tipo/:id', function(req,res){

    let tipo = req.params.tipo;
    let id = req.params.id;

    if(!req.files){
        return res.status(400).json({
            ok:false,
            err:{
                message: 'No se ha seleccionado ningún archivo'
            }
        });
    }

    // validar tipo
    let tiposValidos = ['productos','usuarios'];

    if(tiposValidos.indexOf(tipo) < 0){
        return res.status(400).json({
            ok:false,
            err:{
                message: 'Las tipos permitidos son:' + tiposValidos.join(',')
            }
        });
    }

    let archivo = req.files.archivo;
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length - 1];

    // Extensiones permitidas
    let estensionesValidas = ['png','jpg','gif','jpeg'];

    if(estensionesValidas.indexOf( extension) < 0){
        return res.status(400).json({
            ok:false,
            err:{
                message: 'Las extensiones permitidas son:' + estensionesValidas.join(',')
            }
        });
    }

    // cambiar nombre al archivo (hacerlo único)
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;

    archivo.mv(`uploads/${tipo}/${nombreArchivo}`,function(err){

        if(err)
        {
            return res.status(500).json({
                ok:false,
                err:{
                    message: 'No se ha seleccionado ningún archivo'
                }
            });
        }
    
        // asigna la imagen 
        if(tipo === 'usuarios'){
            imagenUsuario(id, res, nombreArchivo);
        }else{
            imagenProducto(id, res, nombreArchivo);
        }
        
        
    });

});

function imagenUsuario(id, res, nombreArchivo){
    Usuario.findById(id, (err,usuarioBD)=>{

        if(err)
        {
            borrarArchivo(nombreArchivo,'usuarios');

            return res.status(500).json({
                ok:false,
                err
            });
        }

        if(! usuarioBD)
        {
            borrarArchivo(nombreArchivo,'usuarios');

            return res.status(500).json({
                ok:false,
                err: {
                    message: 'Usuario no existe'
                }
            });
        }

        borrarArchivo(usuarioBD.img,'usuarios');

        usuarioBD.img = nombreArchivo;
        usuarioBD.save( (err,usuarioGuarddo)=>{
            res.json({
                ok: true,
                usuario: usuarioGuarddo,
                img: nombreArchivo
            });
        });

    });
}

function imagenProducto(id, res, nombreArchivo){
    Producto.findById(id, (err,productoBD)=>{

        if(err)
        {
            borrarArchivo(nombreArchivo,'productos');

            return res.status(500).json({
                ok:false,
                err
            });
        }

        if(! productoBD)
        {
            borrarArchivo(nombreArchivo,'productos');

            return res.status(500).json({
                ok:false,
                err: {
                    message: 'Producto no existe'
                }
            });
        }

        borrarArchivo(productoBD.img,'productos');

        productoBD.img = nombreArchivo;
        productoBD.save( (err,productoGuardado)=>{
            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchivo
            });
        });

    });


}

function borrarArchivo( nombreimagen, tipo){

    // elimino archivos que ya tiene asignado el usuario
    let pathImagen = path.resolve(__dirname,`../../uploads/usuarios/${ nombreimagen }`);

    if(fs.existsSync(pathImagen)){
                fs.unlinkSync(pathImagen);
    }
    

}

module.exports = app;