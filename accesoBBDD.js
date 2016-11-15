// Conexion a la BBDD
"use strict";

var mysql = require("mysql");
var query;
var conexion = mysql.createConnection({
    host:  "localhost",
    user:  "root",
    password: "root",
    database: "saboteur"
});

var funcionQuery=function(err, rows) 
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
                            };
var accion=function (err) 
            {
                if (err) 
                {
                    console.error(err);
                } 
                else 
                {
                    conexion.query(query,funcionQuery);
                }
                conexion.end();
            }
function entrada(acc, valores, callback)
{
    if(callback===undefined)
        callback=function(){};
    switch(acc)
    {
        //Acciones sobre usuarios(crear, autenticar modificar,etc)
        case "autenticar":
            query="SELECT Nick,Contarseña " + 
                  "FROM Usuarios";
            //Conectamos con la consulta requerida
            conexion.connect(accion);
            break;
        case "crear_usuario":
            if(valores!=null && valores.length===7)
            {
                query="INSERT INTO Usuarios"+
                      "VALUES (null, " + valores.nick +","+
                                       + valores.nombre +","+
                                       + valores.apellidos +","+
                                       + valores.contraseña +","+
                                       + valores.fechaNac +","+
                                       + valores.sexo +","+
                                       + valores.imagen +")";
                //Conectamos con la consulta requerida
                conexion.connect(accion);
            }
            else
            {
                resultado=undefined;
            }
            break;
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
 function ejecutarQuery(acc,valores,callback)
    {
        entrada(acc,valores,callback);
        return resultado;
    }
module.exports=ejecutarQuery;


