

const { Schema, model } = require('mongoose');



const UsuarioSchema = Schema({

    nombre:{
        type: String,
        required: [true, 'Nombre obligatorio']  //se hace arreglo para poner info por default
    },
    correo: {
        type: String,
        required: [true, 'Correo obligatorio'],
        unique: true //para validar que sea unico
    },
    password:{
        type: String,
        required: [true, 'Pass requerida']
    },
    img:{
        type: String
    },
    rol:{
        type: String,
        required: true,
        emun: ['ADMIN_ROLE', 'USER_ROLE']  //sirve para validar que sea cualquiera de los dos roles

    },
    estado: {
        type: Boolean,
        default: true
    },
    google:{
        type: Boolean,
        default: false
    }


});


//haremos un método para no mostrar la contraseña del body
//la siguiente se establece como una función normal, no de flecha porque no funciona como de flecha
//de estar forma el argumento se mantiene fuera
UsuarioSchema.methods.toJSON = function() {
            //se utiliza el ...usuario para indicar que quitando los dos argumentos que no quiero, se inserten
                // en un objeto llamado usuario
    const { __v, password , _id, ...usuario  } = this.toObject();  //se desesctrucura y se ponen los nombres de los campos que no quiero mostrar
    //primero ignoramos el _id que viene de mongo en línea arriba, después 
        ////ahora transformamos _id en uid 
    usuario.uid = _id;
    return usuario;
}



//indicamos que el modelo es Usuarios ya que mongoose añade la S a las colecciones
//e indicamos que el esquema es nuestro esquema UsuarioSchema
module.exports = model('Usuario', UsuarioSchema);
