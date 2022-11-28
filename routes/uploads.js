const { Router } = require('express');
const { check } = require('express-validator');
const { cargarArchivo, actualizarImagen } = require('../controllers/uploads');
const { coleccionesPermitidas } = require('../helpers');
//const validarCampos = require('../middlewares/validar-campos');
const { validarArchivoSubir, validarCampos } = require('../middlewares');


const router = Router();

router.post( '/',validarArchivoSubir, cargarArchivo );

router.put('/:coleccion/:id', [
    validarArchivoSubir,
    check('id', 'El ID must be mongoid').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas( c, ['usuarios', 'productos'])),
    validarCampos
], actualizarImagen)

module.exports = router;