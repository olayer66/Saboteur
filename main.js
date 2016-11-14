"use strict";

var http = require("http");
var servidor = http.createServer(function(request, response) {
    console.log(`Método: ${request.method}`);
    console.log(`URL: ${request.url}`);
    console.log(request.headers);
});
servidor.listen(3000, function(err) {
    if (err) {
        console.log("Error al abrir el puerto 3000: " + err);
    } else {
        console.log("Servidor escuchando en el puerto 3000.");
    }
});



