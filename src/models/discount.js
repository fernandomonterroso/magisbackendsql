'use strict'

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var descuentoSchema = Schema({
    descripcion: String,
    porcentaje: Number,
    producto: [{type: Schema.ObjectId, ref:'Producto'}],
});

module.exports = mongoose.model('Descuento', descuentoSchema);