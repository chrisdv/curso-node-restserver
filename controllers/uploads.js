
const { response } = require('express');
const { subirArchivo } = require('../helpers');
const { Usuario, Producto } = require('../models');



const cargarArchivo = async (req, res = response) =>{

   //console.log ('keys: ', Object.keys(req.files).length, 'req.files: ', req.files, 'archivo: ', req.files.archivo);
    // if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
    //   res.status(400).json({msg: 'No hay archivos para subir.'});
    //   return;
    // }
  

    try {
        const nombre = await subirArchivo(req.files, ['txt', 'md'], 'textos');//incluimos las extensiones txt y md  
        res.json({ nombre })
    } catch (error) {
        res.status(400).json({error});
    }
    
}

const actualizarImagen = async (req, res = response) =>{

    // if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
    //     res.status(400).json({msg: 'No hay archivos para subir.'});
    //     return;
    //   }
    


    const { id, coleccion } = req.params;


    let modelo;

    switch ( coleccion ) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if(!modelo)
                return res.status(400).json({
                    msg: `No existe un usuario con el ID ${id}`
                })
            break;

        case 'productos':
            modelo = await Producto.findById(id);
            if(!modelo)
                return res.status(400).json({
                    msg: `No existe un producto con el ID ${id}`
                })
            break;
    
        default:
            return res.status(500).json({ msg: 'Olvide validar esto' });
            
    }

    const nombre = await subirArchivo( req.files, undefined, coleccion/**Me creará una carpeta con el nombre de la coleccion */);  
    modelo.img = nombre;
    await  modelo.save();

        res.json(modelo);
};



module.exports = {
    cargarArchivo,
    actualizarImagen
}