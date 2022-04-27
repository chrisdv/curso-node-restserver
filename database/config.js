const mongoose = require('mongoose');



const dbConnection = async() => {

    try{
        //ya que estoy en una funcion async, puedo poner un await para que espere primero a intentar realizar la conexión
        await mongoose.connect( process.env.MONGODB_CNN, {
            //useNewUrlParser: true, deprecated
            useUnifiedTopology: true,
            //useCreateIndex: true, deprecated
            //useFindAndModify: false deprecated
        } )
    
        console.log('DB online ujuuu!!');

    }catch(error){
        console.log(error);
        throw new Error('Error al intentar conectar a la DB');
    }

}




module.exports = {
    dbConnection
}