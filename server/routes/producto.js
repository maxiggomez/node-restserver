const express = require('express');
const Producto = require('../models/producto');
const { verificaToken} =  require('../middlewares/autentication');

let app = express();


// Listar producto
app.get('/producto',verificaToken, (req,res)=>{
    let desde = req.query.desde || 0;
    desde = Number(desde);

    Producto.find({disponible:true})
        .skip(desde)
        .limit(5)
        //.populate('usuario','nombre email')
        //.populate('categoria')
        .exec((err,productos)=>{

            if(err){
                res.status(500).json({
                    ok:false,
                    err
                });    
            }

            return res.json({
                ok:true,
                productos 
            });
        });
});

// mostrar por id
app.get('/producto/:id',verificaToken, (req,res)=>{
   
    let id = req.params.id;

    Producto.findById(id,(err,productoBD)=>{

            if(err){
                res.status(500).json({
                    ok:false,
                    err
                });    
            }

            if(!productoBD){
                res.status(500).json({
                    ok:false,
                    err: {
                        message: 'El id no es correcto'
                    }
                });    

            }

            res.json({
                ok:true,
                producto: productoBD 
            });
        });
    
});

// Buscar Productos
app.get('/producto/buscar/:termino', verificaToken, (req,res)=>{

    let termino = req.params.termino;

    let regex = new RegExp(termino,'i') //i: insensible a mayuscula/minuscula

    Producto.find( {nombre:regex})
            //.populate('categoria','nombre')
            .exec( (err,productos)=>{
                if(err){
                    res.status(500).json({
                        ok:false,
                        err
                    });
                }

                res.json({
                    ok:true,
                    productos
                });
            })
});

// Crear
app.post('/producto', verificaToken, (req,res)=>{
    let body = req.body;

    let producto = new Producto({
        descripcion: body.descripcion,
        nombre: body.nombre,
        precioUni: body.precioUni,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err,productoBD)=>{

        if(err){
            res.status(500).json({
                ok:false,
                err
            });
        }

        if(! productoBD){
            return res.status(400).json({
                ok:false,
                err
            });
        }

        res.json({
            ok:true,
            producto: productoBD
        });

    });

});

app.put('/producto/:id', verificaToken, (req,res)=>{
    
    let id = req.params.id;
    let body = req.body;

    Producto.findById(id, (err,productoBD)=>{

        if(err){
            if(err){
                res.status(500).json({
                    ok:false,
                    err
                });
            }    
        }

        if(!productoBD){
            return res.status(400).json({
                ok:false,
                err
            });
        }

        productoBD.nombre = body.nombre;
        productoBD.precioUni = body.precioUni;
        productoBD.categoria = body.categoria;
        productoBD.disponible = body.disponible;
        productoBD.descripcion = body.descripcion;

        productoBD.save( (err,productoGuardado)=>{
            if(err){
                if(err){
                    res.status(500).json({
                        ok:false,
                        err
                    });
                }    
            }
    
            return res.json({
                ok:true,
                producto: productoGuardado
            });
    
        });
    });

});

app.delete('/producto/:id',verificaToken, (req,res)=>{
    
    let id = req.params.id;

// se debe hacer update del campo disponible.

    Producto.findById(id, (err,productoBD)=>{
        
            if(err){
                res.status(500).json({
                    ok:false,
                    err
                });
            }    
        

        if(!productoBD){
            return res.status(400).json({
                ok:false,
                err:{
                    message: 'El id no existe'
                }
            });
        }

        productoBD.disponible = false;
        productoBD.save( (err,productoBorrado)=>{
            if(err){
                res.status(500).json({
                    ok:false,
                    err
                });
            }

            return res.json({
                ok:true,
                producto: productoBorrado,
                mensaje: 'producto borrado'
            });

        });


    });
});

module.exports = app;

