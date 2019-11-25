const express = require('express');
let { verificaToken, verificaAdmin_Role } = require('../middlewares/autentication');

let app = express();

let Categoria = require('../models/categoria');

// Listar categorias
app.get('/categoria',verificaToken, (req,res)=>{

    Categoria.find({})
        .sort('descripcion')
        .populate('usuario','nombre email')
        .exec((err,categorias)=>{

            if(err){
                res.status(500).json({
                    ok:false,
                    err
                });    
            }

            res.json({
                ok:true,
                categorias 
            });
        });
});

// mostrar por id
app.get('/categoria/:id',verificaToken, (req,res)=>{
   
    let id = req.params.id;

    Categoria.findById(id,(err,categoriaBD)=>{

            if(err){
                res.status(500).json({
                    ok:false,
                    err
                });    
            }

            if(!categoriaBD){
                res.status(500).json({
                    ok:false,
                    err: {
                        message: 'El id no es correcto'
                    }
                });    

            }

            res.json({
                ok:true,
                categoria: categoriaBD 
            });
        });
    
});

// Crear
app.post('/categoria', verificaToken, (req,res)=>{
    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err,categoriaBD)=>{

        if(err){
            res.status(500).json({
                ok:false,
                err
            });
        }

        if(! categoriaBD){
            return res.status(400).json({
                ok:false,
                err
            });
        }

        res.json({
            ok:true,
            categoria: categoriaBD
        });

    });

});

app.put('/categoria/:id', verificaToken, (req,res)=>{
    
    let id = req.params.id;
    let body = req.body;

    let descCateogria = {
        descripcion: body.descripcion
    };

    Categoria.findByIdAndUpdate(id,descCateogria,{new: true, runValidators:true},(err,categoriaBD)=>{

        if(err){
            if(err){
                res.status(500).json({
                    ok:false,
                    err
                });
            }    
        }

        if(!categoriaBD){
            return res.status(400).json({
                ok:false,
                err
            });
        }
        res.json({
            ok:true,
            categoria: categoriaBD
        });


    });

});

app.delete('/categoria/:id',[verificaToken,verificaAdmin_Role], (req,res)=>{
    
    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err,categoriaBD)=>{
        if(err){
            if(err){
                res.status(500).json({
                    ok:false,
                    err
                });
            }    
        }

        if(!categoriaBD){
            return res.status(400).json({
                ok:false,
                err:{
                    message: 'El id no existe'
                }
            });
        }

        res.json({
            ok:true,
            message: 'Categoria borrada'
        });
    });
});

module.exports = app;