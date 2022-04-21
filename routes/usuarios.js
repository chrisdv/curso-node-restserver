//utilizamos desestructuracion por medio de las llaves
//la desestructuración es substraer la info de un objeto
const { Router } = require('express'); //obtengo el objeto Router dentro de express
const { usuariosGet, 
    usuariosPost, 
    usuariosPut, 
    usuariosPatch, 
    usuariosDelete } = require('../controllers/usuarios');

const rutas = Router();


rutas.get('/', usuariosGet);
rutas.post('/', usuariosPost);//por medio de los : se define la variable de donde obtendré mi parámetro
rutas.put('/:id', usuariosPut);
rutas.patch('/', usuariosPatch);
rutas.delete('/', usuariosDelete);




module.exports = rutas;