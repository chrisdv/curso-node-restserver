
//con este index evitamos exportar cada js y los exportamos en conjunto

const dbValidators  = require('./db-validators');
const generarJWT    = require('./generar-jwt');
const googleVerify  = require('./google-verify');
const subirArchivo  = require('./subir-archivo');


module.exports = {
    //al poner los ... antes del nombre, indicamos que se incluirán todas las propiedas del respectivo archivo
    ...dbValidators,
    ...generarJWT,
    ...googleVerify,
    ...subirArchivo

}