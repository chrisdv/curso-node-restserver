
const { response } = require("express");
const jwt = require('jsonwebtoken');
const Usuario = require("../models/usuario");

//RECUERDA, EL MIDDLEWARE SE DISPARA CON 3 ARGUMENTOS
    //la request
    //la response

    // y la función next para indicar que debe continuar con otro middleware o controlador
const validarJWT = async ( req = request, res = response, next ) =>{

    const token = req.header('x-token'/*es argumento personalizado*/);
    //console.log("token = ", token);

    if(!token){
        return res.status(401).json({
            msg: 'Sin token'
        });
    }

    try {
        
        //validamos el jsonwebtoken        
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        //console.log("uid: ---->", uid);
        //leer usuario que corresponde al uid
        const usuario = await Usuario.findById(uid);


        //console.log('Usuario:', usuario);
        //console.log('estado:', usuario.estado);

        if(!usuario){
            return res.status(401).json({
                msg: 'El usuario no existe---no existe en DB'
            })
        }
        

        //validar si el usuario está en true (no borrado)
        if(!usuario.estado){
            return res.status(401).json({
                msg: 'Usuario no válido---usuario en false'
            })
        }

        //console.log("req.usuario _>>>>>>>>>>>>>>" , req.usuario);
        req.usuario = usuario;
        //console.log(payload);
        req.uid = uid;
        console.log("usuario jwt: ", req.usuario )
        next();
    } catch (error) {
        res.status(401).json({
            msg: 'Token no valido'
        })
    }


 

}




module.exports = {
    validarJWT
}