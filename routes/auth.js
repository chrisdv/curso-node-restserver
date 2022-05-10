const { Router } = require('express');
const { check } = require('express-validator');
const { login, googleSignin } = require('../controllers/auth');
const validarCampos = require('../middlewares/validar-campos');



const router = Router();

router.post('/login',[
    check('correo', 'El mail es obligatorio').isEmail(),
    check('password', 'Contraseña obligatoria').not().isEmpty(),
    validarCampos
    
], login);


 router.post('/google',[
    check('id_token', 'Google Token obligatorio').not().isEmpty(),    
    validarCampos
    
], googleSignin);



module.exports = router;