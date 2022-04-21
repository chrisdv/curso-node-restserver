const express = require('express');
const cors = require('cors');

class Server{

        constructor(){
            this.app = express();
            this.port = process.env.PORT;
            this.usuariosPath = '/api/usuarios';


            //Middlewares
                //--> son funciones que van a añadir otra funcionalidad al webserver
                //se ejecutan cuando se levanta el servidor

                //Utilizaremos cors que es para darle cierta seguridad a nuestro sitio, se puede hacer una lista blanca por ejemplo
            this.app.use(cors());


            this.middlewares();

                //lectura y parseo del body
            this.app.use( express.json() );  //así se utiliza para que el post serialice o interprete a formato json
            
            
            //rutas de la app
            this.routes();

          
        }


        middlewares(){
            //el use es para indicar que se está utilizando un middleware
            this.app.use(express.static('public'));  //directorio público
        }


    //métodos de la clase server
    routes(){
        this.app.use(this.usuariosPath, require('../routes/usuarios'));
    }

    listen(){        
        this.app.listen(this.port, () =>{
            console.log("running en puerto: ", this.port);
        });
    }
}


module.exports = Server;