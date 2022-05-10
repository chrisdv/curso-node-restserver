const bcryptjs = require('bcryptjs');
const { response } = require('express');
const { json } = require('express/lib/response');
const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');
const Usuario = require('../models/usuario');




const login = async (req, res = response) => {


    const { correo, password } = req.body;

    try{ 
        //validar correo

        const usuario = await Usuario.findOne({ correo });
        if(!usuario){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos => Correo'
            });
        }


        //validar si usuario está activo

        if(!usuario.estado){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos => Status: False'
            });
        }


        //validar contraseña
        const validPassword = bcryptjs.compareSync(password, usuario.password); //con esta funcion se compara la contreña del body vs la contraseña del usuario obtenido de ld DB
        if(!validPassword){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos => Password'
            });
        }

        //generar json web token jwt
            ////como no existe una promesa dentro del jwt, generaremos un callback en los helpers
        const token = await generarJWT( usuario.id );
        res.json({
            usuario,
            token
        });
        
        
    } catch (error) {
        console.log (error);
        return res.status(500).json({
            msg: 'Contacte a su programador'
        
        });

    }
  
    

}


const googleSignin = async( req, res = response ) =>{

    const { id_token } = req.body;
    console.log("entrando a googleSignin");

    try {

        const { correo, nombre, img } = await googleVerify( id_token );

        //validar referencia si es que el correo ya existe en nuestra DB
        let usuario = await Usuario.findOne({ correo });

        //console.log("printing token de google...", id_token);


        if(!usuario){
            console.log("Creando al usuario...");
            //se debe crear el usuario si no existe
            const data = {
                nombre, 
                correo,
                password: 'no valida, es de relleno',
                img,
                google: true,
                rol: 'USER_ROLE'
                
            };
            //console.log("datos de google: ", data);

           usuario = new Usuario( data );
            await usuario.save();
            console.log("Usuario creado: ", usuario);
        }

        //si el usuario en DB está en false, entonces negamos su autenticación
        if(!usuario.estado){
            console.log("validando status de usuario");
            return res.status(401).json({
                msg: 'usuario banneado'
            });
        }
        

        //generar jwt (ya lo tenemos de arriba)
        const token = await generarJWT( usuario.id );
        console.log("jwt generado para ", usuario.id);



        res.json({
            msg: 'Ok, si tienes tu id_token de google, pasale',
            token,
            usuario
        });
    
    } catch (error) {
        res.status(400).json({
            ok: false,
            msg: "el token no se pudo verificar"
        })
    }

   
}



module.exports = {
    login,
    googleSignin
}