"use strict";

//Carga de modulos
var express = require("express");
var fs=require("fs");
var path = require("path");
var bodyParser = require("body-parser");
var accBBDD =require("./accesoBBDD");
var multer=require("multer");
var expressValidator = require("express-validator");
var valFechas= require("./controlFecha");
//Variables
var facMulter= multer({ storage: multer.memoryStorage() });
var recEstaticos= path.join(__dirname, "static");
var servidor= express();
//Configuracion de Express
servidor.set("view engine", "ejs");
servidor.set("views","paginas");

//Middleware
servidor.use(express.static(recEstaticos));
servidor.use(bodyParser.urlencoded({ extended: true }));
servidor.use(expressValidator());
//funcionalidad del servidor
//Metodos GET
servidor.get("/",function(req,res)
{
    res.status(200);
    res.render("inicio",{IDUsuario:null});
});
servidor.get("/nuevousuario",function(req,res)
{
    res.status(200);
    res.render("nuevousuario",{errores:null});
});
servidor.get("/login",function(req,res)
{
    res.status(200);
    res.render("loginusuario",{errores:null});
});
//Metodos POST
servidor.post("/nuevousuario",facMulter.single("imgPerfil"), function(req, res) 
{
    //control de contenido    
        //Campos vacios
            req.checkBody("nick","El campo nick no puede estar vacio").notEmpty();
            req.checkBody("nombre","El campo nombre no puede estar vacio").notEmpty();
            req.checkBody("apellidos","El campo apellidos no puede estar vacio").notEmpty();
            req.checkBody("contra","El campo contraseña no puede estar vacio").notEmpty();
            req.checkBody("contraRep","El campo confirmacion no puede estar vacio").notEmpty();
            req.checkBody("fechaNac","El campo fecha de nacimiento no puede estar vacio").notEmpty();
            req.checkBody("sexo","El campo sexo no puede estar vacio").notEmpty();
        //Control de tipos de datos
            req.checkBody("nick","El campo nick solo puede contener letras y numeros").matches(/^[A-Z0-9]*$/i);
            req.checkBody("nombre","El campo nombre solo puede contener letras").matches(/^[A-Z\s]*$/i);
            req.checkBody("apellidos","El campo apellidos solo puede contener letras").matches(/^[A-Z\s]*$/i);
            req.checkBody("contra","El campo contraseña solo puede contener letras y numeros").matches(/^[A-Z0-9]*$/i);
            req.checkBody("contraRep","El campo verificacion solo puede contener letras y numeros").matches(/^[A-Z0-9]*$/i);
        //Control de contraseña (personalizado)
            req.checkBody("contra","El campo contraseña ha de tener entre 4 y 8 caracteres").isLength({ min: 4, max: 8 });
            req.checkBody("contraRep","El campo de confirmacion de contraseña ha de tener entre 4 y 8 caracteres").isLength({ min: 4, max: 8 });
            req.checkBody("contra","La repeticion de la contraseña no es igual").equals(req.body.contraRep);
        //Control de la fecha (personalizado)
        //if(req.checkBody("fechaNac","El campo fecha de nacimiento no es valido").isDate())
        //    req.checkBody("fechaNac","El campo fecha de nacimiento Debe ser anterior a lafecha actual").isBefore();
    //Validacion del contenido
    req.getValidationResult().then(function(result) 
    {
        //Carga de la imagen de perfil
        if (result.isEmpty()) 
        {
            if (req.file)
            {
                req.body.imgPerfil= req.file.buffer;
            }
            else
            {
                req.body.imgPerfil=null;
            }
            //Llamada a la BBDD
            accBBDD.crearUsuario(req.body,function(err,salida)
            {
                if(err)
                {
                    res.status(400);
                    res.render("error",{cabecera:"400-Error al crear la cuenta",
                                        mensaje: err.message,
                                        pila: err.stack});
                }
                else
                {
                    res.status(200);
                    res.render("usuariocreado",{IDUsuario:null,nick:req.body.nick});
                }
            });
        } 
        else 
        {
             res.status(200);
             res.render("nuevousuario",{errores:result.array()});
        }
    });
});

servidor.post("/volvernuevo", function(req, res) 
{
   res.status(200);
   res.render("nuevousuario",null);
});

servidor.post("/loginusuario", function(req, res) 
{
    //control de contenido    
        //Campos vacios
            req.checkBody("nick","El campo nick no puede estar vacio").notEmpty();
            req.checkBody("contra","El campo contraseña no puede estar vacio").notEmpty();
        //Control de tipos de datos
            req.checkBody("nick","El campo nick solo puede contener letras y numeros").matches(/^[A-Z0-9]*$/i);
            req.checkBody("contra","El campo contraseña solo puede contener letras y numeros").matches(/^[A-Z0-9]*$/i);
        //Control de contraseña (personalizado)
            req.checkBody("contra","El campo contraseña ha de tener entre 4 y 8 caracteres").isLength({ min: 4, max: 8 });

    //Validacion del contenido
    req.getValidationResult().then(function(result) 
    {
        if (result.isEmpty()) 
        {
            accBBDD.crearUsuario(req.body,function(err,salida)
            {
                if(err)
                {
                    res.status(400);
                    res.render("error",{cabecera:"400-Error al logearse",
                                        mensaje: err.message,
                                        pila: err.stack});
                }
                else
                {
                    res.status(200);
                    res.render("verpartidas",{IDUsuario:null,nick:req.body.nick});
                }
            });
        } 
        else 
        {
             res.status(200);
             res.render("nuevousuario",{errores:result.array()});
        }
    });
});

servidor.post("/volvernuevo", function(req, res) 
{
   res.status(200);
   res.render("nuevousuario",null);
});
/*======================================INICIO DEL SERVIDOR==============================================*/
//Abrimos el servidor a la escucha por el puerto 3000
servidor.listen(3000, function(err) {
    if (err) {
        console.log("Error al abrir el puerto 3000: " + err);
    } else {
        console.log("Servidor escuchando en el puerto 3000.");
    }
});