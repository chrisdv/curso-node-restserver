
const { validationResult } = require('express-validator');


const validarCampos = ( req, res, next) => {  /* como es un middleware lleva un parametro next y llama una
                                            función debajo de la validacion*/

    const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json(errors);
        }

    next();  //se indica que continua con el siguiente middleware
}




module.exports = {validarCampos};