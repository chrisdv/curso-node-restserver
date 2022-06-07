const { Router } = require('express');
const { buscar } = require('../controllers/buscar');


const router = Router();

router.get('/:coleccion/:termino', buscar)
//se reciben dos argumentos, el primero es para 





module.exports = router;