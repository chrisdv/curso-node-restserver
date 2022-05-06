const jwt = require('jsonwebtoken');



const generarJWT = ( uid = '') =>{

    return new Promise(( resolve, reject ) => {
        
        const payload = { uid };  // no debemos cargar tanta información en el jwt ya que es sensible
        jwt.sign(payload, process.env.SECRETORPRIVATEKEY, {
            expiresIn: '4h'
        }, (err, token) => {
            if( err ){
                console.log( err );
                reject( 'No se pudo generar el token');
            }else{
                resolve( token );
            }
        });

    })
}


module.exports = {
    generarJWT
}