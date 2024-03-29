
const { response } =  require('express');
const { ObjectId } = require('mongoose').Types;
const { Usuario, Categoria, Producto } = require('../models');

const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles'
];


const buscarUsuarios = async( termino = '', res = response) =>{

    const esMongoID = ObjectId.isValid( termino);//estamos pidiendo que sea true 

    if( esMongoID ){
        const usuario = await Usuario.findById( termino );
        return res.json({
            results:  //aplicaremos un operador ternario (que es un if corto)
                    ( usuario ) ? [usuario] : []
                    //si el usuario existe, regresamos el objeto usuario, si no: regresamos un arreglo vacío
        });
    }

    //expresion regular
    const regex = new RegExp( termino, 'i');//indicamos que la expresión regular recibe el termino y es insensible a mayús/minús

    const usuarios = await Usuario.find({ 
        $or: [{nombre: regex}, {correo: regex}]
        ,$and: [{estado: true}] //con simbolo de $ es propio de mongo para indicar que es una condicion
     });
    res.json({
        results: usuarios
    });


}



const buscarCategorias = async( termino = '', res = response) =>{

    const esMongoID = ObjectId.isValid( termino );    
    if(esMongoID){
        const categoria = await Categoria.findById(termino);
        return res.json({
            results: (categoria) ? [categoria] : []
        });
    }

  
    const regex = new RegExp(termino, 'i');
    const categorias = await Categoria.find({
        nombre: regex, estado: true
        
    });

    res.json({      
            results: categorias        
    });


}


const buscarProductos = async(termino = '', res = response) => {

    const esMongoID = ObjectId.isValid( termino );
    if(esMongoID){
        const producto = await Producto.findById(termino).populate('categoria', 'nombre');
        return res.json({
            results: (producto) ? [producto] : []
        })
    }


    const regex = new RegExp(termino, 'i');
    const productos = await Producto.find({
        nombre: regex, estado: true
    }).populate('categoria', 'nombre')

    res.json({
        results: [productos]
    });

}



const buscar = (req, res = response) => {

    const { coleccion, termino } = req.params;


    if(!coleccionesPermitidas.includes( coleccion )){
        res.status(400).json({
            msg: `Las colecciones permitidas son: ${coleccionesPermitidas}`
        })
    }
    switch(coleccion){
        case 'usuarios':
            buscarUsuarios( termino, res );

            break;
        
        case 'categorias':
            buscarCategorias(termino, res);

            break;
        
        case 'productos':
            buscarProductos(termino, res);

            break;

        default:
            res.status(500).json({
                msg: 'Olvidé hacer esta búsqueda'
            })

        
    }

}


module.exports = {
    buscar
}