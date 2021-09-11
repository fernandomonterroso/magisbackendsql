'use strict'

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var contactoSchema = Schema({
    codigo: String,
    nombre: String,
    precio: Number,
    stock: Number,
    stockOrigin: Number,
    descripcion: String,
    imagen: [],
    fehaIng: { type: Date, default: Date.now() },
    categoria: [{type: Schema.ObjectId, ref:'Categoria'}],
    estado: String, //1 ACTIVO 2 BAJA
});

module.exports = mongoose.model('Producto', contactoSchema);