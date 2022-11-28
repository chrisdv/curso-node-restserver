const path = require('path');  //se invoca al método path de nodejs para poder utilizar las url de las ruta y unir las rutas para el uploadpath
const { v4: uuidv4} = require('uuid')         //utilizamos uuid para hacer nombres unicos de los archivos subidos
//al hacer v4: estamos renombrando 

const subirArchivo = ( files, extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'], carpeta = '') =>{
    
    //utilizaremos promises cuando queremos saber cuando algo sale bien o mal

    return new Promise((resolve, reject) =>{

        const { archivo } = files;
        const nombreCortado = archivo.name.split('.');
        const extension = nombreCortado[nombreCortado.length -1];
        
    
        //validar la extension
      
        if(!extensionesValidas.includes(extension)){
            return reject(`La extension ${extension} no es permitida, debe ser ${extensionesValidas} `)          
        }

        const nombreTemp = uuidv4() + '.' + extension;
        const uploadPath = path.join( __dirname, '../uploads/', carpeta, nombreTemp);
    
        archivo.mv(uploadPath, (err) =>{
        if (err) {
            console.log(err);
            //return res.status(500).json({err});
            reject(err);
        }
    
            //res.json({msg:'File uploaded to ' + uploadPath});
            resolve(nombreTemp);
        });


        });


    

};







module.exports = {
    subirArchivo
}