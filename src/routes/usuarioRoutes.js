'use strict'

var express = require("express");
var UserController = require("../controllers/usuarioController");
var ContactoController = require("../controllers/contactoController");
 var CorreoController = require("../controllers/correoController");
 var TareaController = require("../controllers/tareaControllers");

//MAGGIS
var CategoryController = require("../controllers/categoryController");
var ProductController = require("../controllers/productController");
var DiscountController = require("../controllers/discountController");
var md_auth = require('../middleware/aunthenticated');

//SUBIR IMAGEN
var multiparty = require('connect-multiparty');
var md_subir = multiparty({uploadDir: './src/uploads/users'})

var api = express.Router();
api.post('/registrar' ,UserController.registrar)
api.post('/login', UserController.login);
api.post('/subir-imagen-usuario/:id', [md_auth.ensureAuth, md_subir] ,UserController.subirImagen);
api.get('/obtener-imagen-usuario/:imageFile', UserController.getImageFile);
api.put('/editar-usuario/:id', md_auth.ensureAuth, UserController.editarUsuario);
api.post('/crear-contacto', md_auth.ensureAuth, ContactoController.crearContacto);
api.get('/listarContacto/:id', md_auth.ensureAuth, ContactoController.listarContacto);
api.get('/listarContactos', md_auth.ensureAuth, ContactoController.listarContactos);
api.put('/editarContacto/:id',md_auth.ensureAuth, ContactoController.editarContacto);
api.post('/subir-imagen-contacto/:id', [md_auth.ensureAuth, md_subir] ,ContactoController.subirImagen);
api.get('/obtener-imagen-contacto/:imageFile', ContactoController.getImageFile);
api.delete('/borrar-contacto/:id', md_auth.ensureAuth,ContactoController.eliminarContacto);
api.post('/correo', md_auth.ensureAuth, CorreoController.correo);
api.post('/crearTarea',md_auth.ensureAuth,TareaController.crearTarea);
api.get('/listarTarea/:id', md_auth.ensureAuth, TareaController.listarTarea);
api.get('/listarTareas', md_auth.ensureAuth, TareaController.listarTareas);
api.put('/editarTarea/:id',md_auth.ensureAuth, TareaController.editarTarea);
api.post('/subir-imagen-tarea/:id', [md_auth.ensureAuth, md_subir] ,TareaController.subirImagen);
api.get('/obtener-imagen-tarea/:imageFile', TareaController.getImageFile);
api.delete('/borrar-tarea/:id', md_auth.ensureAuth,TareaController.eliminarTarea);

//MAGGIES
api.post('/crearCategoria',CategoryController.createCategory);
api.get('/get',ProductController.createCategory);
//api.post('/crearProducto',ProductController.createProduct);
//api.get('/listarProductos',ProductController.listarProductos);
api.post('/crearDescuento',DiscountController.createDiscount);
module.exports = api;   