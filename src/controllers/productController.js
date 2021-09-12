'use strict'
const conexion = require("../../conexion");
function createCategory(req, res) {


    const binds ={ gafete:"1"};
    conexion.queryObject('src/resource/consultas/prueba.txt', binds, {autoCommit: true})
    .then(function(result) {
        //console.log(result);
        return res.status(200).send({info: result});
    })
    .catch(function(err) {
        //console.log(err);
        return res.status(500).send({message: err.toString()});
    });
    /*
    var tarea = new Tarea();
    var params = req.body;

    if (params.tarea) {
       
    } else {
        res.status(200).send({mesagge: 'Rellene los datos necesarios'})
    }
    */
}

module.exports = {

    
    createCategory,
    

}