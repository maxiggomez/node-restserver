const express = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

const app = express();

app.post('/login',(req, res) =>{
   
    let body = req.body;
    Usuario.findOne({ email: body.email}, (err,usuarioDB)=>{

        if(err){
            res.status(400).json({
                ok:false,
                err
            });
        }
        
        if( !usuarioDB){
            return res.status(500).json({
                ok:false,
                err:{
                    message: '(Usuario) o contraseña incorrectos'
                }
            });
            
        }


        if( !bcrypt.compareSync( body.password,usuarioDB.password ) ){
            return res.status(400).json({
                ok:false,
                err:{
                    message: 'Usuario o (contraseña) incorrectos'
                }
            });

        }

        let token = jwt.sign({
            usuario: usuarioDB
            },process.env.SEED,{expiresIn: process.env.CADUCIDAD_TOKEN}
        )    

        res.json({
                ok:true,
                usuario: usuarioDB,
                token

        })

    })

});

// Configuraciones de google: Este código te la da google
async function verify( token ) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();

    return{
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}
  

app.post('/google', async(req, res) =>{

    let token = req.body.idtoken;

    // llamamos a la funcino de verificacion de google
    let googleUser = await verify( token )
                        .catch(e=>{
                            res.status(403).json({
                                    ok: false,
                                    err: e
                            });
                        });

    Usuario.findOne({ email:googleUser.email}, (err, usuarioDB)=>{

        if(err){
            res.status(500).json({
                ok:false,
                err
            });
        }

        if(usuarioDB){

            if(usuarioDB.google === false){
                res.status(400).json({
                    ok:false,
                    err:{
                        message: 'Debe usar autenticación normal'
                    }
                });
    
            }else{
                // EL usuario existe y renuevo el token
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED,{expiresIn: process.env.CADUCIDAD_TOKEN});

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                });
            }
        }else{
            // El usuario no existe en le BD
            let usuario = new Usuario();

            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = '=)';

            // Alta de usuario
            usuario.save((err,usuarioDB)=>{

                if(err){
                    res.status(500).json({
                        ok:false,
                        err
                    });
                }

                // Con el usuario dado de alta, genero el token
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED,{expiresIn: process.env.CADUCIDAD_TOKEN});

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                });


            });
        }

    });


                        /*
    res.json({
        usuario: googleUser    
    });
*/
});

module.exports = app;