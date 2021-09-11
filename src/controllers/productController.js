'use strict'

var bcrypt = require("bcrypt-nodejs");
var Tarea = require('../models/tarea');
var Product = require('../models/product');
var jwt = require('../services/jwt')
var path = require('path');
var fs = require('fs');
const Category = require("../models/category");
const discount = require("../models/discount");

function createProduct(req, res) {
    var ProductModel = new Product();
    var params = req.body;

    if (params.nombre) {
        ProductModel.codigo = params.codigo;
        ProductModel.nombre = params.nombre;
        ProductModel.precio = params.precio;
        ProductModel.stock = params.stock;
        ProductModel.stockOrigin = params.stock;
        ProductModel.descripcion = params.descripcion;
        ProductModel.imagen = params.imagen;
        ProductModel.categoria = params.categoria;
        ProductModel.estado = "1" ;
        Product.find({$or:[
            {codigo: ProductModel.codigo.toLowerCase()},{nombre: ProductModel.nombre.toLowerCase()}
        ]}).exec((err, codigos)=>{
            if(err) return res.status(500).send({mesagge: 'Error en la peticion de Usuario'})
            if(codigos && codigos.length>=100){
                return res.status(500).send({mesagge: 'La categoria ya existe'});
            }else{
                ProductModel.save((err,productGuardado)=>{
                        if(err) return res.status(500).send({mesagge: 'Error en guardar la categoria: '+err})
                        
                        if(productGuardado){
                            res.status(200).send({product: productGuardado})
                        }else{
                            res.status(404).send({mesagge : 'no se a podido registar la categoria'})
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

var Discount = require('../models/discount');
var conta;
var cantidad;
function listarProductos(req, res) {
    var page = parseInt(req.query.page);
    var limit = parseInt(req.query.limit);
    console.log("______________________________________________");
    console.log("recibe page:",page,"recibe limit:",limit);
        const skip = (page - 1) * limit; 
        const limited = page * limit;
        console.log("calculados:",skip,limit);

        let query = {};
        if(1==1){
            query = { 'estado' : '1' };
        }else{
            query = { 'estado' : '1' ,'categorias.nombre': "aretes"};
        };
        console.log(query);
        /*
        Product.countDocuments([{$match: query}],(err, productos) => {
            //if (err) return res.status(500).send({ message: err });
            console.log(productos);
            cantidad = productos;
           // if (!productos) return res.status(400).send({ message: 'Error al listar las encuestas' });
    
            //return res.status(200).send({ productos:productos,general: conta });
        });
        */
    const result ={};
    if(limited <parseInt(cantidad)){
        result.next ={
            page: page +1,
            limit : limit
        };
    }

    if(skip >0){
        result.previous ={
            page: page - 1,
            limit : limit
        };
    }
    console.log(skip,limited,result);

    
    Discount.find({general:1}, (err, contactos) => {
        if (err) return res.status(500).send({ message: 'error en las encuestas' });

        //if (!contactos) return res.status(400).send({ message: 'Error al listar las encuestas' });
        conta = contactos;
        //return res.status(200).send({ contactos:contactos });
    });
    
    
    
   
    Product.aggregate([
        
        {$match: query},
        {
         
        
          $count: "cantidad"
        
      }],(err, productos) => {
            //if (err) return res.status(500).send({ message: err });
            console.log("res",productos[0]);
            cantidad = productos[0];
           // if (!productos) return res.status(400).send({ message: 'Error al listar las encuestas' });
    
            //return res.status(200).send({ productos:productos,general: conta });
        });
        

        // si es nula true
        var versionNumber="aretes";
        var param = { south: 11, north: 15, west: 10, east: 20, category: null };

        
    Product.aggregate([
        {
        $lookup:
            {
                from: "categorias",
                localField: "categoria",
                foreignField : "_id",
                as: "categorias"
            }
        }
        /*
        ,{
        $lookup:
            {
                from: "descuentos",
                localField: "_id",
                foreignField : "producto",
                as: "descuentos"
            }
        }
        */
        ,{
            $lookup:
                {
                    from: "descuentos",
                    localField: "categorias._id",
                    foreignField : "categoria",
                    as: "descuentos"
                }
            }
        ,
        

        {
            $addFields: { isParamCategory: { $eq: [ versionNumber, null ] } } 
        },
        //$addFields: { "descuentos.porcentaje": 20 } 
        //{"$project":{"numFields":{"$size":{"$objectToArray":"$$ROOT"}}}},
        //ocultar campos
        { $project: { "descuentos.categoria" : 0,"descuentos.descripcion" : 0  } },
        
         // This is your query
           
            
        //{ $project: { "descuentos": { "descripcion": 0,"categoria" : 0}, "categoria" : 0 } },
        
        //{ $project:{"productos": { "descuentos": { "porcentaje": 0 } } } },
        //,{ $project : { "descuentos" :{ "categoria": 1 }, "porcentaje" : 0 } },
        { 
            //query
            $match: query// { 'estado' : '1'
            
            //'categorias.nombre': ""
             //        },
            //$elemMatch: { "categorias.nombre": "aretes" }
            
         },
         { $skip: skip },   // Always apply 'skip' before 'limit'
         { $limit: limit },
         //contar en arreglo
         /*
         {
            $addFields: {
              totalHomework: { $sum: "$homework" } ,
              totalQuiz: { $sum: "$descuentos.porcentaje" }
            }
          },
          {
            $addFields: { totalScore:
              { $add: [ "$totalHomework", "$totalQuiz", "$extraCredit" ] } }
          },
         /*
         {
            $count: "passing_scores"
          }
          */
    ],(err, productos) => {
            if (err) return res.status(500).send({ message: err });
    
            if (!productos) return res.status(400).send({ message: 'Error al listar las encuestas' });
    
            //return res.status(200).send({ parametros: cantidad,productos:productos,general: conta });

            result.parametros =cantidad;
            result.productos =productos;
            result.general =conta;
            return res.status(200).send(result);
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
    createProduct,
    listarProducto,
    listarProductos,
    editarTarea,
    eliminarTarea,

}