const { response } = require('express');


const usuariosGet = (req, res = response) => {
    
    const {q, nombre, apikey} = req.query;
    
    res.json({
        ok: true,
        msg: 'get API -- Controlador',
        q,
        nombre,
        apikey
    });
}



const usuariosPost = (req, res = response)=>{
    
    //obtendremos los parametros del evento post
    const { nombre, edad  } = req.body;//obtenemos los parametros del body
    
    res.json({
        
        msg: 'post API -- Controlador',
        nombre,
        edad
    });
}


const usuariosPut = (req, res = response)=>{
    
    const id = req.params.id;//con params se obtiene el parametro y el nombre de la variable
    
    res.json({
        id: id,
        msg: 'put API --Controlador'
    });
}


const usuariosPatch = (req, res = response)=>{
    res.json({
        ok: true,
        msg: 'patch API --Controlador'
    });
}



const usuariosDelete = (req, res = response)=>{
    res.json({
        ok: true,
        msg: 'delete API --Controlador'
    });
}

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}