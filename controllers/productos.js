const { response } = require("express");
const { Producto } = require('../models/');





//TODO

/**OBTENER CATEGORIAS
 * 
 *  Paginado
 *  total 
 *  populate (es de mongoose) ---> es para saber qué usuario creó o modificó el registro
 */

const obtenerProductos= async ( req, res = response ) =>{

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true};

    
    const [ productos, total ] = await Promise.all([

        
        Producto.find( query )
        .populate('usuario', 'nombre') //populate(primero es la referencia, segundo el dato que deseamos obtener)
        .populate('categoria', 'nombre')
        .limit(Number, limite)
        .skip(Number(desde))
        
        /*.exec(( err, usuario) => {
            console.log(usuario)
        })*/,

        
        Producto.countDocuments(query)
        
        
    ]);


    res.json({
        total,
        productos           
    });

}




/** OBTENER CATEGORIA UNA
 * populate {regresar el objeto de la categoria}
 * 
 */

const obtenerProducto= async (req, res = response) =>{

    const { id } = req.params;

        //console.log('entrando a obtener 1 cat');
    const producto = await Producto.findById(id)
        .populate('categoria', 'nombre')
        .populate('usuario', 'nombre');

    console.log('prod: ', producto);
    if(!producto){
        res.json.status(400)({
            msg: `el producto ${id} no existe`
        })
    }

    if(!producto.estado){
        res.json.status(401)({
            msg: `El producto ${id} está desactivado`
        })
    }

    res.json({
        producto
    })

}




const crearProducto = async (req, res = response) =>{

    //descarto estado y usuario del req.body y me quedó con lo demás del body y lo llamo pues body
    const { estado, usuario, ...body } = req.body;

    const productoDB = await Producto.findOne( {nombre: body.nombre});

    if(productoDB){
        return res.status(400).json({
            msg: `El producto ${productoDB.nombre} ya existe`
        })
    }

    //Generar la data para guardar
    const data = {
        ...body, //de esta forma asigno dentro del data todo lo que hay en el body
        nombre: body.nombre.toUpperCase(),      
        usuario: req.usuario._id,
        
    }

    const producto = new Producto( data );
    console.log('producto', producto);

    //guardar en DB
    
    try {
        await producto.save();

        res.status(201).json(producto);

    } catch (error) {
        console.log(error);
        res.status(400).json({
            msg: 'No se pudo guardar el producto'
        })
    }    

}

/** ACTUALIZAR CATEGORIA
 * recibir el nombre, se deberá cambiar el nombre, validar que el nombre exista y que el nuevo no exista
 */

const actualizarProducto = async(req, res = response) =>{

    //obtener el estado, el usuario que lo modificará y todo lo demás
    const { estado, usuario, categoria, ...data} = req.body;  
    const { id } = req.params;

    if(data.nombre){
        data.nombre = data.nombre.toUpperCase();    
    }

    
    //voy a mantener el último usuario que hizo el update
    data.usuario = req.usuario._id;
    //console.log("nombre: ", nombre, "id: ", id)
    //data.categoria = req.categoria


    //buscar si ya existe la categoria y actualizar
    //new:true es para que envié el documento ya atualizado, esto es para mostrarlo pero ya se guarda con el update
    const producto = await Producto.findByIdAndUpdate( id, data, { new:true} );

    res.status(200).json(producto);
   

}



/** BORRAR CATEGORIA
 * Solamente es cambiar estado a false
 * 
 */


const borrarProducto = async(req, res = response) =>{
    
    const { id } = req.params;
    
    
    
    
    const producto = await Producto.findByIdAndUpdate( id,  {estado: false}, {new:true} );
    console.log("producto delete ", producto);
    res.status(200).json(producto);
}





module.exports = {
    actualizarProducto,
    borrarProducto,
    crearProducto,
    obtenerProducto,
    obtenerProductos
    
}