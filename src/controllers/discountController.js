'use strict'

var bcrypt = require("bcrypt-nodejs");
var Tarea = require('../models/tarea');
var Discount = require('../models/discount');
var jwt = require('../services/jwt')
var path = require('path');
var fs = require('fs');

function createDiscount(req, res) {
    var DiscountModel = new Discount();
    var params = req.body;

    if (params.descripcion) {
        DiscountModel.descripcion = params.descripcion;
        DiscountModel.porcentaje = params.porcentaje;
        DiscountModel.producto = params.producto;

        Discount.find({$or:[
            {porcentaje: DiscountModel.porcentaje}
        ]}).exec((err, codigos)=>{
            if(err) return res.status(500).send({mesagge: 'Error en la peticion de Usuario'})
            if(codigos && codigos.length>=3){
                return res.status(500).send({mesagge: 'El descuento ya existe'});
            }else{
                DiscountModel.save((err,discountGuardado)=>{
                        if(err) return res.status(500).send({mesagge: 'Error en guardar la categoria: '+err})
                        
                        if(discountGuardado){
                            res.status(200).send({descuento: discountGuardado})
                        }else{
                            res.status(404).send({mesagge : 'no se a podido registar el descuento'})
                        }
                    })
                
            }
        })
    } else {
        res.status(200).send({
            mesagge: 'Rellene los datos necesarios'
        })
    }
}

function crearTarea(req, res) {
    var tarea = new Tarea();
    var params = req.body;

    if (params.tarea) {
        tarea.tarea = params.tarea;
        tarea.descripcion = params.descripcion;
        tarea.tiempo = params.tiempo;
        tarea.image = params.image;
        tarea.usuario = req.user.sub;
            let contacId = req.user.sub;
        Tarea.find({ usuario: contacId, 
            $or: [
                { tarea: tarea.tarea.toLowerCase()}, {descripcion: tarea.descripcion.toLowerCase()}
            ]
        }).exec((err, tareas) => {
            if (err) return res.status(500).send({ mesagge: 'Error en la peticion de Usuario' })
            if (tareas && tareas.length >= 1) {
                return res.status(500).send({ mesagge: 'La tarea ya existe' });
            } else {


                tarea.save((err, tareaGuardada) => {
                    if (err) return res.status(500).send({ mesagge: 'Error en guardar el usuario' })

                    if (tareaGuardada) {
                        res.status(200).send({ tarea })
                    } else {
                        res.status(404).send({ mesagge: 'no se a podido registar al usuario' })
                    }
                })

            }
        })
    } else {
        res.status(200).send({
            mesagge: 'Rellene los datos necesarios'
        })
    }
}

function listarProducto(req, res) {
    var tareaId = req.params.id;

    Tarea.findById(tareaId, (err, tarea) => {
        if (err) return res.status(500).send({ message: 'error en la tarea' })
        if (!tarea) return res.status(400).send({ message: 'error al listar las tareas' })

        return res.status(200).send({tarea })
    })
}


function listarProductos(req, res) {

    Product.aggregate([{
        $lookup:
            {
                from: "categorias",
                localField: "categoria",
                foreignField : "_id",
                as: "categorias"
            }
        },{
        $lookup:
            {
                from: "categorias",
                localField: "categoria",
                foreignField : "_id",
                as: "categorias"
            }
        },{ $match: { 'estado' : '1' } }],(err, productos) => {
            if (err) return res.status(500).send({ message: 'error en las encuestas' });
    
            if (!productos) return res.status(400).send({ message: 'Error al listar las encuestas' });
    
            return res.status(200).send({ productos:productos });
        })

    /*
    Product.find({}, (err, productos) => {
        if (err) return res.status(500).send({ message: 'error en las encuestas' });

        if (!productos) return res.status(400).send({ message: 'Error al listar las encuestas' });

        return res.status(200).send({ productos:productos });
    });
    */
}


function editarTarea(req, res) {
    var tareaId = req.params.id;
    var params = req.body;


    Tarea.findByIdAndUpdate(tareaId, params, { new: true }, (err, tareaActualizada) => {
        if (err) return res.status(500).send({ mesagge: 'Error en la peticion' })

        if (!tareaActualizada) return res.status(404).send({ mesagge: 'No se han podido actualizar los datos de la tarea' })

        return res.status(200).send({ tarea: tareaActualizada });
    })
}

function eliminarTarea(req, res) {
    let tareaId = req.params.id;
    
    Tarea.findByIdAndDelete(tareaId, (err, tareaEliminada) => {
        if (err)
            return res.status(500).send({ message: 'Error en la petición' });
        if (!tareaEliminada)
            return res.status(404).send({ message: 'No se ha podido eliminar la tarea' });
        return res.status(200).send({ tarea: tareaEliminada });
    });
}


function subirImagen(req, res) {
    var userId = req.params.id;
    if (req.files) {
        var file_path = req.files.image.path;
        console.log(file_path);
        var file_split = file_path.split('\\');
        console.log(file_split);

        var file_name = file_split[3];
        console.log(file_name);

        var ext_xplit = file_name.split('\.');
        console.log(ext_xplit);

        var file_ext = ext_xplit[1];
        console.log(file_ext);

        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif' || file_ext == 'jfif') {
            Tarea.findByIdAndUpdate(userId, { image: file_name }, { new: true }, (err, usuarioActualizado) => {
                if (err) return res.status(500).send({ mesagge: 'error en la peticion' })

                if (!usuarioActualizado) return res.status(404).send({ mesagge: 'No se a podido actualizar el usuario' })

                return res.status(200).send({ contacto: usuarioActualizado })

            })
        } else {
            return removeFilerOfUploads(res, file_path, 'Extension no valida')
        }
    }
}

function removeFilerOfUploads(res, file_path, message) {
    fs.unlink(file_path, (err) => {
        return res.status(200).send({
            mesagge: message
        })
    })
}

function getImageFile(req, res) {
    var image_file = req.params.imageFile;
    var path_file = './src/uploads/users/' + image_file;
    fs.exists(path_file, (exists) => {
        if (exists) {
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(200).send({ mesagge: 'no existe la imagen' });
        }
    })
}


module.exports = {

    subirImagen,
    getImageFile,
    createDiscount,
    listarProducto,
    listarProductos,
    editarTarea,
    eliminarTarea,

}