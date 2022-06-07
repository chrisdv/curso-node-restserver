const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');

class Server{

        constructor(){
            this.app = express();
            this.port = process.env.PORT;
            //en lugar de tener un string por cada ruta, hacemos un json para todas las rutas
            // this.usuariosPath = '/api/usuarios';
            // this.authPath = '/api/auth';
            this.paths = {
                auth:        '/api/auth',
                buscar:      '/api/buscar',
                categorias:  '/api/categorias',
                productos:   '/api/productos',
                usuarios:    '/api/usuarios'
            }

            //Conexion a DB
            this.conectarDB();


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


        //haremos un metodo para la conexión a la DB
        async conectarDB(){            
            await dbConnection();
        }


        middlewares(){
            //el use es para indicar que se está utilizando un middleware
            this.app.use(express.static('public'));  //directorio público
        }


    //métodos de la clase server
    routes(){
            /////como ya cambiamos los strings de las rutas, ahora pondremos con el objeto y la propiedad
        // this.app.use(this.authPath, require('../routes/auth'));
        // this.app.use(this.usuariosPath, require('../routes/usuarios'));
        
        this.app.use(this.paths.auth, require('../routes/auth'));
        this.app.use(this.paths.buscar, require('../routes/buscar'));
        this.app.use(this.paths.categorias, require('../routes/categorias'));
        this.app.use(this.paths.productos, require('../routes/productos'));       
        this.app.use(this.paths.usuarios, require('../routes/usuarios'));

    }

    listen(){        
        this.app.listen(this.port, () =>{
            console.log("running en puerto: ", this.port);
        });
    }
}


module.exports = Server;