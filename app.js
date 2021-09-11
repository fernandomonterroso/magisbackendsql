'use strict'

const express = require("express");
const app = express();
const bodyparser = require("body-parser");

//CARGAR RUTAS  
var usuario_routes = require('./src/routes/usuarioRoutes');
//var contacto_routes = require('./src/routes/contactoRoutes');
//MIDDELWARES
app.use(bodyparser.urlencoded({extended: false}));
app.use(bodyparser.json());

//CABEZERAS
app.use((req, res, next)=>{
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow','GET, POST, OPTIONS, PUT, DELETE');
    
    next();
})

//RUTAS 
app.use('/api', usuario_routes, );

//EXPORTAR AFUERA DE CLASE
module.exports = app;