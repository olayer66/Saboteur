"use strict";

var express = require("express");
var servidor= express();

//Configuracion de Express
servidor.set("views",paginas);

//funcionalidad del servidor
servidor.get("",);

//Abrimos el servidor a la escucha por el puerto 3000
servidor.listen(3000, function(err) {
    if (err) {
        console.log("Error al abrir el puerto 3000: " + err);
    } else {
        console.log("Servidor escuchando en el puerto 3000.");
    }
});