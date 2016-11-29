"use strict";

//Carga de modulos
var express = require("express");
var fs=require("fs");
var path = require("path");
var bodyParser = require("body-parser");
var accBBDD =require("./accesoBBDD");
//Variables
var servidor= express();
var recEstaticos= path.join(__dirname, "static");
//Configuracion de Express
servidor.set("view engine", "ejs");
servidor.set("views","paginas");

//Middleware
servidor.use(express.static(recEstaticos));
servidor.use(bodyParser.urlencoded({ extended: true }));
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
    res.render("nuevousuario",null);
});

//Metodos POST
servidor.post("/nuevousuario", function(req, res) 
{
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
            res.render("/usuariocreado",req.body.nick);
        }
    });
});
servidor.post("/volvernuevo", function(req, res) 
{
   res.status(200);
   res.render("nuevousuario",null);
});
//Abrimos el servidor a la escucha por el puerto 3000
servidor.listen(3000, function(err) {
    if (err) {
        console.log("Error al abrir el puerto 3000: " + err);
    } else {
        console.log("Servidor escuchando en el puerto 3000.");
    }
});