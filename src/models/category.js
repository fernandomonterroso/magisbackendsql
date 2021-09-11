'use strict'

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var categoriaSchema = Schema({
    nombre: String,
    descripcion: String
});

module.exports = mongoose.model('Categoria', categoriaSchema);