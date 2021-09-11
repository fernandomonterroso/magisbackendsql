'use strict'

var bcrypt = require("bcrypt-nodejs");
var User =require('../models/usuario');
var jwt = require('../services/jwt')
var path = require('path');
var fs = require('fs');

function registrar(req, res) {
    var user = new User();
    var params = req.body;
    
    if(params.nombre && params.nick && params.email && params.password){
        user.nombre = params.nombre;
        user.apellido = params.apellido;
        user.nick = params.nick;
        user.email = params.email;
        user.image = null;

        User.find({$or:[
            {email: user.email.toLowerCase()},{nick: user.nick.toLowerCase()}
        ]}).exec((err, users)=>{
            if(err) return res.status(500).send({mesagge: 'Error en la peticion de Usuario'})
            if(users && users.length>=1){
                return res.status(500).send({mesagge: 'El Usuario ya existe'});
            }else{
                
                    user.password = params.password;
                    user.save((err,userGuardado)=>{
                        if(err) return res.status(500).send({mesagge: 'Error en guardar el usuario'})
                        
                        if(userGuardado){
                            res.status(200).send({user: userGuardado})
                        }else{
                            res.status(404).send({mesagge : 'no se a podido registar al usuario'})
                        }
                    })
                
            }
        })
    }else{
        res.status(200).send({
            mesagge: 'Rellene los datos necesarios'
        })
    }
}

function login(req, res){
        var params = req.body;
        var email = params.email;
        var password = params.password;

        User.findOne({email: email},(err, user)=>{
            if(err) return res.status(500).send({mesagge: 'error en la peticion'})

            if (user) {
                if(user){
                    if (params.gettoken) {
                                    return res.status(200).send({ 
                                           token: jwt.createToken(user)
                                       });
                }else{
                                    user.password = undefined;
                                     return res.status(200).send({user})
                               }
            }
        }
            //     bcrypt.compare(password, user.password, (err, check)=>{
            //         if(check){
            //             if (params.gettoken) {
            //                 return res.status(200).send({ 
            //                     token: jwt.createToken(user)
            //                 });
                            
            //             }else{
            //                 user.password = undefined;
            //                 return res.status(200).send({user})
            //             }
            //         }else{
            //             return res.status(404).send({mesagge: 'El usuario no a podido indentificarse'})
            //         }
            //     })     
            // }
            else{
                return res.status(404).send({mesagge: 'El usuario no a podido loguarse'})
            }
        });
}

function subirImagen(req, res){
    var userId = req.params.id;
    if (req.files) {
        var file_path= req.files.image.path;
        console.log(file_path);
        var file_split = file_path.split('\\');
        console.log(file_split);

        var file_name = file_split[3];
        console.log(file_name);

        var ext_xplit = file_name.split('\.');
        console.log(ext_xplit);

        var file_ext = ext_xplit[1];
        console.log(file_ext);
        
        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif' || file_ext == 'jfif' ) {
            User.findByIdAndUpdate(userId, {image: file_name}, {new: true}, (err, usuarioActualizado)=>{
                if(err) return res.status(500).send({mesagge: 'error en la peticion'})

                if(!usuarioActualizado) return res.status(404).send({mesagge: 'No se a podido actualizar el usuario'})

                return res.status(200).send({user: usuarioActualizado})

            })
        }else{
             return removeFilerOfUploads(res, file_path, 'Extension no valida')
        }
    }
}

function removeFilerOfUploads(res, file_path, message) {
    fs.unlink(file_path,(err)=>{
        return res.status(200).send({
            mesagge: message
        })
    })
}

function getImageFile(req, res) {
    var image_file = req.params.imageFile;
    var path_file = './src/uploads/users/' + image_file;
    fs.exists(path_file, (exists)=>{
        if (exists) {
            res.sendFile(path.resolve(path_file));
        }else{
            res.status(200).send({mesagge: 'no existe la imagen'});
        }
    })
}

function editarUsuario(req, res) {
    var userId = req.params.id;
    var params = req.body;

    //BORRAR LA PROPIEDAD DE PASSWORD
    delete params.password;

    if (userId != req.user.sub) {
        return res.status(500).send({mesagge: 'No tiene los permiso para editar este usuario'});
    }

    User.findByIdAndUpdate(userId, params, {new: true},(err, usuarioActualizado)=>{
        if(err) return res.status(500).send({mesagge: 'Error en la peticion'})

        if(!usuarioActualizado) return res.status(404).send({mesagge: 'No se han podido actualizar los datos del usuario'})
    
        return res.status(200).send({user: usuarioActualizado});
    })
}



module.exports = {
    registrar,
    login,
    subirImagen,
    getImageFile,
    editarUsuario,
    
}