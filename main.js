"use strict";

//Carga de modulos
var express = require("express");
var fs=require("fs");
var path = require("path");

//Variables
var servidor= express();
var recEstaticos= path.join(__dirname, "static");
var datos;
//Configuracion de Express
servidor.set("view engine", "ejs");
servidor.set("views","paginas");

//Middleware
servidor.use(express.static(recEstaticos));
//funcionalidad del servidor
servidor.get("/",function(req,res){
    res.status(200);
    res.render("inicio",datos);
    res.end();
});
servidor.get("/nuevousuario",function(req,res){
    res.status(200);
    res.render("nuevousuario",null);
    res.end();
});

//Abrimos el servidor a la escucha por el puerto 3000
servidor.listen(3000, function(err) {
    if (err) {
        console.log("Error al abrir el puerto 3000: " + err);
    } else {
        console.log("Servidor escuchando en el puerto 3000.");
    }
});