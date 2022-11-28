

const { Router } = require('express');
const { check } = require('express-validator');
const { login, googleSignin } = require('../controllers/auth');
const { crearCategoria, 
        obtenerCategorias, 
        obtenerCategoria, 
        actualizarCategoria, 
        borrarCategoria} = require('../controllers/categorias');
const { usuariosGet } = require('../controllers/usuarios');
const { existeCategoriaPorID } = require('../helpers/db-validators');
const { validarJWT, validarCampos, esAdminRole} = require('../middlewares/'); //no nos funcionó el index con los middlewares por eso ocupamos rutas completas
//const validarCampos = require('../middlewares/validar-campos');
//const { esAdminRole } = require('../middlewares/validar-roles');


const router = Router();

/*Debemos apuntar hacia:   
    {{url}}/api/categorias
*/


//Obtener todas las categorias-----> es public
router.get('/', obtenerCategorias);



//Obtener solo una categoria por id  -----> es public
/**
 * Se debe hacer un middleware personalizado con validación personalizada para aquellos que tengan Id
 * para validar el id
 */
/*router.get('/:id',[
    check.apply('id').custom(existeCategoria) //haremos un check para validar si existe categoria y estara en los helpers
], ( req, res) => {
    res.json('servicio get categoria por id')
});
*/

router.get('/:id',[
    check('id', 'No es un id de mongo').isMongoId(),
    check('id').custom(existeCategoriaPorID),
    validarCampos
], obtenerCategoria)


//Crear una categoria  -----------> es privado, con cualquier user autenticado con un token  valido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria);



//Actualizar el registo por id   ---------> privado con cualquier token valido
/**
 * debe validar que exista la categoria
 */
router.put('/:id', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id').custom(existeCategoriaPorID),
    validarCampos,

], actualizarCategoria);



//Borrar categoria  -----------> solo si es admin valido
/**
 * debe validar que sea un id de mongo
 */
router.delete('/:id', [
    validarJWT,
    check('id').custom(existeCategoriaPorID),
    esAdminRole,    
    check('id', 'No es ID valido de MongoID').isMongoId(),
    validarCampos
], borrarCategoria);



module.exports = router;