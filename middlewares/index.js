
//Busca directamente por ser index.js

//Haremos una exportación para tener una sola línea de código al llamar a estos middlewares
/** */

const validameCampos = require('../middlewares/validar-Campos');
const validameJWT = require('../middlewares/validar-jwt');
const validameRoles = require('../middlewares/validar-roles');


module.exports = {
    //utilizaremos el operador spread para que tome todos los elementos que se exportan
        //de los middlewares
    ...validameCampos,
    ...validameJWT,
    ...validameRoles

}