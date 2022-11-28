
const Role = require('../models/role');
const {Usuario, Categoria, Producto} = require('../models');



const esRoleValido = async(rol = '') => {//custom es para que tome nuestro middleware personalizado
    //el custom recibe el valor del campo rol que viene del body
        //se asigna vacío a rol en caso de que no venga nada
const existeRol = await Role.findOne({rol});  //busco si existe un dato del campo rol que ya exista
if(!existeRol){
    throw new Error(`El rol ${rol} no existe`);  //se envia un error personalizado si no existe el rol
    }
}


const emailExiste = async (correo = '') => {

    const existeEmail = await Usuario.findOne( { correo } );  //busca si el correo es igual al ingresado   
    if( existeEmail ){    

        throw new Error(`El email ${correo} ya existe`);
        // return res.status(400).json({
        //     msg: 'El correo ya existe'
        // })
    }
}



const existeUsuarioPorID = async (id) => {

    const existeUsuario = await Usuario.findById(id);  //busca si el correo es igual al ingresado   
    if( !existeUsuario ){    

        throw new Error(`El id ${id} no existe`);
        // return res.status(400).json({
        //     msg: 'El correo ya existe'
        // })
    }
}



const existeCategoriaPorID = async(id) =>{
    //console.log("existe categoria ID???");

    const existeCategoria = await Categoria.findById( id );
    if(!existeCategoria){
        throw new Error(`El id ${id} de la categoria no existe`);
    }


}


const existeProductoPorID = async(id) =>{
    //console.log("existe categoria ID???");

    const existeProducto = await Producto.findById( id );
    if(!existeProducto){
        throw new Error(`El id ${id} del producto no existe`);
    }


}



const coleccionesPermitidas = ( coleccion = '', colecciones = []) => {

    const incluida = colecciones.includes( coleccion );

    if(!incluida)
        throw new Error(`La coleccion ${coleccion} no es permitida, las permitidas son ${colecciones}`);

    return true;
}




module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorID,
    existeCategoriaPorID,
    existeProductoPorID,
    coleccionesPermitidas
}