const express = require('express');
const Usuario = require('../models/usuario');
const { verificaToken, verificaAdmin_Role } =  require('../middlewares/autentication');

const bcrypt = require('bcrypt');
const _ = require('underscore');

const app = express();

const bodyParse = require('body-parser');
app.use(bodyParse.urlencoded({extended:false}));
app.use(bodyParse.json());

app.get('/usuario', verificaToken,(req, res)=>{

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    // Filtro por los que tienen estado=true
    Usuario.find({ estado: true},'nombre email role estado img') // El segundo parametro permite describir que campos mostrar
            .skip(desde)
            .limit(limite)
            .exec((err,usuarios) =>{
                if(err){
                    return res.status(400).json({
                        ok:false,
                        err
                    })
                }

                // Retorno los usuarios que regreso la BD y el número de registros.
                Usuario.count({ estado: true},(err,conteo)=>{
                    res.json({
                        ok: true,
                        usuarios,
                        cuantos: conteo
                    });    
                });    


            })

})

app.post('/usuario', [verificaToken,verificaAdmin_Role],(req, res)=>{
    let body = req.body;
    
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password:  bcrypt.hashSync(  body.password, 10 ),
        role: body.role
    });
    
    usuario.save( (err,usuarioDB) =>{
        if(err){
            res.status(400).json({
                ok:false,
                err
            });
        }
        else
        {    
            console.log('grabado OK');
            
            res.json({
                ok:true,
                usuario: usuarioDB
            });
        }    
    });


})


app.put('/usuario/:id', [verificaToken, verificaAdmin_Role],(req, res)=>{
    let id = req.params.id;
    // Del objeto solo filtro las propiedades que permito actualizar
    let body = _.pick(req.body,['nombre','email','img','role','estado']);

    Usuario.findByIdAndUpdate(id,body, { new: true, runValidators: true}, (error, usuarioDB)=>{

        if(error){
            res.status(400).json({
                ok:false,
                error
            });
        }
        else
        {
            console.log('grabo');
            res.status(200).json({
                ok: true,
                usuario: usuarioDB
            });
        }
    } )

})

app.delete('/usuario/:id', [verificaToken,verificaAdmin_Role],(req, res)=>{
    
    let id = req.params.id;
    let cambiaEstado = { estado: false};

    //Usuario.findByIdAndRemove(id, (err, usuarioBorrado)=>{
    Usuario.findByIdAndUpdate(id, cambiaEstado,{new:true}, (err, usuarioBorrado)=>{
            if(err){
                return res.status(400).json({
                    ok: false,
                    err
                });
            };


            if(!usuarioBorrado){
                return res.status(400).json({
                    ok: false,
                    error: {
                        message: 'Usuario no encontrado.'
                    }
                });
            };


            res.json({
                ok:true,
                usuario: usuarioBorrado
            });
    } );

})

// Expongo app para que se vean en otros modulos
module.exports = app;