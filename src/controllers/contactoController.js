'use strict'

var bcrypt = require("bcrypt-nodejs");
var Contacto = require('../models/contacto');
var jwt = require('../services/jwt')
var path = require('path');
var fs = require('fs');

function crearContacto(req, res) {
    var contacto = new Contacto();
    var params = req.body;

    if (params.nombre) {
        contacto.nombre = params.nombre;
        contacto.apellido = params.apellido;
        contacto.apodo = params.apodo;
        contacto.correo = params.correo;
        contacto.direccion = params.direccion;
        contacto.image = params.image;
        contacto.telefono = params.telefono;
        contacto.usuario = req.user.sub;
            let contacId = req.user.sub;
        Contacto.find({ usuario: contacId, 
            $or: [
                { correo: contacto.correo.toLowerCase() }, { telefono: contacto.telefono.toLowerCase() }
            ]
        }).exec((err, contactos) => {
            if (err) return res.status(500).send({ mesagge: 'Error en la peticion de Usuario' })
            if (contactos && contactos.length >= 1) {
                return res.status(500).send({ mesagge: 'El Usuario ya existe' });
            } else {


                contacto.save((err, contactoGuardado) => {
                    if (err) return res.status(500).send({ mesagge: 'Error en guardar el usuario' })

                    if (contactoGuardado) {
                        res.status(200).send({ contacto: contactoGuardado })
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

function listarContacto(req, res) {
    var contactoId = req.params.id;

    Contacto.findById(contactoId, (err, contacto) => {
        if (err) return res.status(500).send({ message: 'error en la encuesta' })
        if (!contacto) return res.status(400).send({ message: 'error al listar las encuestas' })

        return res.status(200).send({ contacto })
    })
}


function listarContactos(req, res) {
    let userId = req.user.sub;
    Contacto.find({ usuario: userId }, (err, contactos) => {
        if (err) return res.status(500).send({ message: 'error en las encuestas' });

        if (!contactos) return res.status(400).send({ message: 'Error al listar las encuestas' });

        return res.status(200).send({ contactos:contactos });
    });
}


function editarContacto(req, res) {
    var contactoId = req.params.id;
    var params = req.body;


    Contacto.findByIdAndUpdate(contactoId, params, { new: true }, (err, contactoActualizado) => {
        if (err) return res.status(500).send({ mesagge: 'Error en la peticion' })

        if (!contactoActualizado) return res.status(404).send({ mesagge: 'No se han podido actualizar los datos del usuario' })

        return res.status(200).send({ Contacto: contactoActualizado });
    })
}

function eliminarContacto(req, res) {
    let contactoId = req.params.id;
    
    Contacto.findByIdAndDelete(contactoId, (err, contactoEliminado) => {
        if (err)
            return res.status(500).send({ message: 'Error en la petición' });
        if (!contactoEliminado)
            return res.status(404).send({ message: 'No se ha podido eliminar empresa' });
        return res.status(200).send({ contacto: contactoEliminado });
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
            Contacto.findByIdAndUpdate(userId, { image: file_name }, { new: true }, (err, usuarioActualizado) => {
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
    crearContacto,
    listarContacto,
    listarContactos,
    editarContacto,
    eliminarContacto,

}