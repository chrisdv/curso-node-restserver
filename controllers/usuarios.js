const { response } = require('express');
const bcryptjs = require('bcryptjs');



//solicitaremos el modelo usuario, es para utilizar el esquema de mongoose
const Usuario = require('../models/usuario');//por estandar se utiliza en mayúscula para hacer instancias



const usuariosGet = async(req, res = response) => {
    
    //const {q, nombre, apikey} = req.query;  ya no se utiliza
    const { limite = 5, desde = 0 } = req.query;
    const query = {estado: true};
    
    ///comentamos el siguiente código porque se pondrá más abajo en un arreglo de promesas
    ////para que se cumplan de manera asincrona y cumpla el await sin el await
    // const usuarios = await(Usuario.find(query))  /**puedo poner una condición dentro del find para que solo 
    // me arroje los usuarios con estado = true */
    //     .limit(Number(limite))
    //     .skip(Number(desde));

    // const total = await Usuario.countDocuments(query);
 

    const [usuarios, total] /**desestructuracion de arreglos */= await Promise.all([/**me permite tener un arreglo con todas las promesas que quiero que se ejecuten
    es decir, mis awaits  */
    //las constantes deben el orden de acuerdo a las funciones de más abajo

        Usuario.find(query)  /**puedo poner una condición dentro del find para que solo 
                                            me arroje los usuarios con estado = true */
        .limit(Number(limite))
        .skip(Number(desde)),
    
        Usuario.countDocuments(query)
    ]);  


    res.json({
        total,
        usuarios
    });
}



const usuariosPost = async (req, res = response)=>{

    /* SE COMENTARAN LAS SIGUIENTES LINEAS PORQUE LAS LLEVAREMOS A UN MIDDLEWARE PERSONALIZADO
        ESTO PARA OPTIMIZAR EL CODIGO Y NO COPIAR Y PEGAR PARA CADA RUTA

        //recibo errores del check del router en server.js

        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json(errors);
        }


    */
    //obtendremos los parametros del evento post
    const {nombre, correo, password, rol}= req.body;//obtenemos los parametros del body
    //haremos una constante para instanciar mi esquema de modelo usuario
    const usuario = new Usuario( {nombre, correo, password, rol });
                //console.log("entrando a usuariosPost, printing usuario....", usuario);
    //validar si existe el correo
       /*****se instalará npm i express-validator que es para validar los correos */
    
    
    //SE CREARA HELPER PARA VALIDAR EMAIL Y NO TENERLO POR CADA CONTROLADOR
     /*  const existeEmail = await Usuario.findOne( { correo } );  //busca si el correo es igual al ingresado
            //      console.log("Email: ", correo, "  existe? ", existeEmail);
    
    if( existeEmail ){
        //          console.log("entrando al if existeEmail");
        return res.status(400).json({
            msg: 'El correo ya existe'
        })
    };
    */
    //console.log('antes de bcrypt', password);

    //hash de password
    const salt = bcryptjs.genSaltSync();  //numero de vueltas para encriptar , por defecto en 10
    //console.log('salt: ', salt);
    usuario.password = bcryptjs.hashSync (password/*ya está desestructurado*/ , salt); 


    //guardaremos en DB
    await usuario.save();

    res.json(usuario);
}


const usuariosPut = async(req, res = response)=>{
    
    const { id } = req.params;//con params se obtiene el parametro y el nombre de la variable
    //desestructuro la info del query

    const { _id, password, google, correo, ...resto}  = req.body;

    //TODO validar vs DB
    if( password ){
          //hash de password
        const salt = bcryptjs.genSaltSync();  //numero de vueltas para encriptar , por defecto en 10
        //console.log('salt: ', salt);
        resto.password = bcryptjs.hashSync (password/*ya está desestructurado*/ , salt);
    }

    const usuario = await Usuario.findByIdAndUpdate ( id, resto);

    res.json({
        id: id,
        usuario
    });
}


const usuariosPatch = (req, res = response)=>{
    res.json({
        ok: true,
        msg: 'patch API --Controlador'
    });
}



const usuariosDelete = async(req, res = response)=>{

    const { id } = req.params;

    //borrado fisico
    //const usuario = await Usuario.findByIdAndDelete(id);


    const usuario = await Usuario.findByIdAndUpdate(id, {estado : false});

    res.json({     
        msg: 'se borró el id: ',
        id
    });
}

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}