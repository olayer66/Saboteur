// Conexion a la BBDD
"use strict";

var mysql = require("mysql");
var query;
var valoresEntrada;
var conexion = mysql.createConnection({
    host:  "localhost",
    user:  "root",
    password: "root",
    database: "saboteur"
});
// Salida del modulo con todas las funciones
module.exports={
    autenticar: autenticar,
    crearUsuario: crearUsuario,
    estaConectado: conectado,
    partidasUsuario: partidasUsuario
    
    
};
var accion=function (callback,err) 
            {
                if (err) 
                {
                    console.error(err);
                } 
                else 
                {
                    conexion.query(query,valoresEntrada,function(err, rows) 
                            {
                                if (err) 
                                {
                                    console.error(err);
                                    callback(err);
                                } 
                                else 
                                {
                                    callback(rows);
                                }
                            });
                }
                conexion.end();
            }
function entrada(acc, valores, callback)
{
    if(callback===undefined)
        callback=function(){};
    switch(acc)
    {
        case "modificar_usuario":
            if(valores!=null && valores.length===7)
            {
                query="UPDATE Usuarios"+
                      "SET  Nick=" + valores.nick +","+
                           "Nombre=" + valores.nombre +","+
                           "Apellidos="+ valores.apellidos +","+
                           "Contraseña"+ valores.contraseña +","+
                           "Fecha_Nac="+ valores.fechaNac +","+
                           "Sexo="+ valores.sexo +","+
                           "Imagen="+ valores.imagen;
                //Conectamos con la consulta requerida
                conexion.connect(accion);
            }
            else
            {
                resultado=undefined;
            }
            break;
        case "partidas_usuario":
            break;
        //No se si sera necearia(intuyo que no)
        case "salir":
            break;
        // acciones sobre Partidas
        case "crear_partida":
            break;
        case "borrar_partida":
            break;
        case "modificar_partida":
            break;
        case "usuarios_partida":
            break;
        //Aciones sobre los tableros guardados
        case "extraer_tablero":
            query="SELECT * " + 
                  "FROM tableros"+
                  "WHERE ID_Partida ="+valor;
            //Conectamos con la consulta requerida
            conexion.connect(accion);
            break;
        default:
            console.log("cosulta no encontrada");
    }
    return resultado;
}
//Funciones para el control de usuarios
function crearUsuario(valores,callback)
{
    if(callback===undefined)
        callback=function(){};
    if(valores!==null && valores.length===7)
    {
        query="INSERT INTO Usuarios"+
              "VALUES (null,?,?,?,?,?,?,?)";
        //Conectamos con la consulta requerida
        valoresEntrada=[valores.nick,valores.nombre,valores.apellidos,valores.contraseña,valores.fechaNac,valores.sexo,valores.imagen];
        conexion.connect(function(err) { accion(err, callback); });
    }
    else
    {
        callback(null);
    }
}
function autenticar(nick,callback)
{
    if(nick!==null && nick==="String")
    {
    query="SELECT Nick,Contarseña " + 
          "FROM Usuarios"+
          "WHERE Nick= ?";
    valoresEntrada=[nick];
    //Conectamos con la consulta requerida
    conexion.connect(function(err) { accion(err, callback); });
    }
    else
    {
        callback(null);
    }
}
function conectado(ID,callback)
{
    
}
function partidasUsuario(ID,callback)
{
    
}

