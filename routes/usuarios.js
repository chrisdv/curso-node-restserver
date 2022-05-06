//utilizamos desestructuracion por medio de las llaves
//la desestructuración es substraer la info de un objeto
const { Router } = require('express'); //obtengo el objeto Router dentro de express
const { check } = require('express-validator');



 const validarCampos = require('../middlewares/validar-campos');
 const { validarJWT } = require('../middlewares/validar-jwt');
 const { esAdminRole, tieneRole } = require('../middlewares/validar-roles');

/*const { validarCampos,
    validarJWT,
    esAdminRole, 
    tieneRole }  = require ('../middlewares');
*/
const { esRoleValido, emailExiste, existeUsuarioPorID } = require('../helpers/db-validators');

const { usuariosGet, 
    usuariosPost, 
    usuariosPut, 
    usuariosPatch, 
    usuariosDelete } = require('../controllers/usuarios');
const req = require('express/lib/request');

const rutas = Router();


rutas.get('/', usuariosGet);
/*se tendrá un middleware para realizar validaciones antes de que entre a la ruta de usuariosPost
     y así evitar que haga trabajo innecesario, el middleware es para 
     que se ejecute código antes de otro código
     
     se debe poner como segundo argumento en la ruta y si son varios middlewares se 
     ponen como un arreglo, como se muestra a continuación:

     */
rutas.post('/',[//en el body el parámetro se llama correo
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password es obligatorio y más de 6 letras').isLength({min:6}),
        check('correo', 'El formato de email no es correo').isEmail(),    
    //quitamos esta linea porque leeremos el rol desde DB check('rol', 'Rol inválido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check('rol').custom( esRoleValido), /**no se pone como funcion de flecha porque se obvia el argumento, el primer argumento que se recibe es igual al que se envía, se puede obviar el => */
    check('correo').custom( emailExiste),
    validarCampos
    //el check prepara los errores y cuando vaya a mi controlador post, envío los errores y en el controlador los muestro
], usuariosPost);

rutas.put('/:id',[
    check('id', 'No es ID valido o MongoID').isMongoId(), /*revisamos si existe un password y si es válido*/
    check('id').custom(existeUsuarioPorID),
    check('rol').custom( esRoleValido ),
    validarCampos
], usuariosPut);//por medio de los : se define la variable de donde obtendré mi parámetro
rutas.patch('/', usuariosPatch);
rutas.delete('/:id', [
    validarJWT,
    //esAdminRole,
    tieneRole('ADMIN_ROLE', 'VENTAS_ROLE', 'NOSE'),
    check('id', 'No es ID valido de MongoID').isMongoId(),
    check('id').custom(existeUsuarioPorID),
    validarCampos
], usuariosDelete);




module.exports = rutas;