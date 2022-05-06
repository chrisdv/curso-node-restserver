const { response } = require('express');



const esAdminRole = ( req, res = response, next ) =>{


    //obtenemos el usuario por medio de la request que ya tenemos a partir del middleware
        //donde se valida el jwt así que....:
    if(!req.usuario)    {
        return res.status(500).json({
            msg: 'Se debe validar el role del usuario, no se ha validado token'
        })
    }

    //estraemos el role y usuario
    const { role, nombre } = req.usuario;

    if ( role !== 'ADMIN_ROLE'){
        return res.status(401).json({
            msg: `${nombre} no es administrador  -- Intente de nuevo`
        })
    }

    next();

}

//utilizamos el operador REST (le llaman resto de operadores)
//depende de dónde se utilice puede ser REST o SPREAD
        //para nuestro caso, si es en los argumentos se toma como operador REST
const tieneRole = ( ...roles ) =>{  /**Se crea un arreglo de roles con el operador REST */

    
    //tenemos que devolver una funcion hacia las rutas que cae dentro
    //de sus argumentos en tieneRole porque se trata de un middleware
    return ( req, res = response, next ) => {

        if(!req.usuario)    {
            return res.status(500).json({
                msg: 'Se debe validar el role del usuario, no se ha validado token'
            })
        }

        if( !roles.includes( req.usuario.rol) ){
            return res.status(401).json({
                msg: `El rol ${req.usuario.rol} no es válido, debes ser ${roles}`
            })
        }

        console.log('ESTOY EN TIENEROLE', roles);
        console.log("printing el rol actual", req.usuario.rol);
        next();
    }
}


module.exports = {
   esAdminRole,
   tieneRole
}