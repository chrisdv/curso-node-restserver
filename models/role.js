const { Schema, model } = require('mongoose');


const RoleSchema = Schema({

    rol: {
        type: String,
        require: [true, 'El rol es obligatorio']
    }

});




//lleva dos argumentos, el nombre que queremos darle y la constante con el objeto (campos)
module.exports = model( 'Role', RoleSchema)