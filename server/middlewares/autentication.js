const jwt = require('jsonwebtoken');

// Verificar Token

let verificaToken = ( req,res, next) =>{
    // tomo el token que viaja en el Header
    let token = req.get('token');
    console.log(token);

    jwt.verify( token, process.env.SEED, (err, decoded)=>{

        if(err){
            return res.status(401).json({
                ok:false,
                err: {
                    message: 'Token no válido'
                }        
            });
        }

        req.usuario = decoded.usuario;
        next();    
    })

};

// Verifica Admin_Role

let verificaAdmin_Role = ( req,res, next) =>{
    
    let usuario = req.usuario;

    if(usuario.role === 'ADMIN_ROLE'){
        next();
    }else{

        return res.status(401).json({
            ok:false,
            err: {
                message: 'Usuario no es Admin'
            }        
        });

    }

    

};

module.exports = {
    verificaToken,
    verificaAdmin_Role
}