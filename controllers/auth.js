const bcryptjs = require('bcryptjs');
const { response } = require('express');
const { generarJWT } = require('../helpers/generar-jwt');
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


module.exports = {
    login
}