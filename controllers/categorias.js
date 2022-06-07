const { response } = require("express");
const { Categoria } = require('../models/');





//TODO

/**OBTENER CATEGORIAS
 * 
 *  Paginado
 *  total 
 *  populate (es de mongoose) ---> es para saber qué usuario creó o modificó el registro
 */

const obtenerCategorias = async ( req, res = response ) =>{

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true};

    
    const [ categorias, total ] = await Promise.all([

        
        Categoria.find( query )
        .populate('usuario', 'nombre') //populate(primero es la referencia, segundo el dato que deseamos obtener)
        .limit(Number, limite)
        .skip(Number(desde))
        
        /*.exec(( err, usuario) => {
            console.log(usuario)
        })*/,

        
        Categoria.countDocuments(query)
        
        
    ]);


    res.json({
        total,
        categorias           
    });

}




/** OBTENER CATEGORIA UNA
 * populate {regresar el objeto de la categoria}
 * 
 */

const obtenerCategoria = async (req, res = response) =>{

    const { id } = req.params;

        //console.log('entrando a obtener 1 cat');
    const categoria = await Categoria.findById(id).populate('usuario', 'nombre');

    console.log('cat: ',categoria);
    if(!categoria){
        res.json.status(400)({
            msg: `La categoria ${id} no existe`
        })
    }

    if(!categoria.estado){
        res.json.status(401)({
            msg: `La categoria ${id} está desactivada`
        })
    }

    res.json({
        categoria
    })

}




const crearCategoria = async (req, res = response) =>{

    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne( {nombre});

    if(categoriaDB){
        return res.status(400).json({
            msg: `La categoria ${categoriaDB.nombre} ya existe`
        })
    }

    //Generar la data para guardar
    const data = {
        nombre, 
        usuario: req.usuario._id
    }

    const categoria = new Categoria( data );

    //guardar en DB
    
    try {
        await categoria.save();

        res.status(201).json(categoria);

    } catch (error) {
        res.status(400).json({
            msg: 'No se pudo guardar la categoria'
        })
    }    

}

/** ACTUALIZAR CATEGORIA
 * recibir el nombre, se deberá cambiar el nombre, validar que el nombre exista y que el nuevo no exista
 */

const actualizarCategoria = async(req, res = response) =>{

    //obtener el estado, el usuario que lo modificará y todo lo demás
    const { estado, usuario, ...data} = req.body;  
    const { id } = req.params;

    data.nombre = data.nombre.toUpperCase();
    //voy a mantener el último usuario que hizo el update
    data.usuario = req.usuario._id;
    //console.log("nombre: ", nombre, "id: ", id)


    //buscar si ya existe la categoria y actualizar
    //new:true es para que envié el documento ya atualizado, esto es para mostrarlo pero ya se guarda con el update
    const categoria = await Categoria.findByIdAndUpdate( id, data, { new:true} );

    res.status(200).json(categoria);
   

}



/** BORRAR CATEGORIA
 * Solamente es cambiar estado a false
 * 
 */


const borrarCategoria = async(req, res = response) =>{
    
    const { id } = req.params;
    
    
    
    
    const categoria = await Categoria.findByIdAndUpdate( id,  {estado: false}, {new:true} );
    console.log("categoria delete ", categoria);
    res.status(200).json(categoria);
}





module.exports = {
    actualizarCategoria,
    borrarCategoria,
    crearCategoria,
    obtenerCategoria,
    obtenerCategorias
    
}