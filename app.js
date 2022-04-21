require ('dotenv').config();
const Server = require('./models/server.js');



const srv = new Server();

srv.listen();
