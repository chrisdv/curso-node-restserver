const { Schema, model } = require('mongoose');



const ProductoSchema = Schema({

    nombre: {
        type: String,
        require: [true, 'El nombre es obligatorio'],
        unique: true
    },
    estado: {
        type: Boolean,
        default: true,
        required: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    precio: {
        type: Number,
        default: 0
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        required: true
    },
    descripcion: {
        type: String
    },
    disponible: {
        type: Boolean,
        default: true
    },
    img: {
        type: String
    }

});


ProductoSchema.methods.toJSON = function() {
    //se utiliza el ...usuario para indicar que quitando los dos argumentos que no quiero, se inserten
        // en un objeto llamado usuario
const { __v, estado, ...data   } = this.toObject();  //se desesctrucura y se ponen los nombres de los campos que no quiero mostrar
//primero ignoramos el _id que viene de mongo en línea arriba, después 
////ahora transformamos _id en uid 

return data;
}




//lleva dos argumentos, el nombre que queremos darle y la constante con el objeto (campos)
module.exports = model( 'Producto', ProductoSchema)