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
    //Usuarios
    conectar: conectar,
    desconectar: desconectar,
    estaConectado: estaConectado,
    crearUsuario: crearUsuario,
    modificarUsuario: modificarUsuario,
    mostrarUsuario: mostrarUsuario,
    //Partidas
    crearPartida: crearPartida,
    mostrarPartida: mostrarPartida,
    borrarPartida: borrarPartida, 
    //Asignacion de partidas
    partidasUsuario: partidasUsuario,
    usuariosPartida:usuariosPartida,
    borrarAsignacionPartidas:borrarAsignacionPartidas,
    borrarUsuarioDePartida:borrarUsuarioDePartida
    //tableros
    
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
                        callback(err,null);
                    } 
                    else 
                    {
                        callback(null,rows);
                    }
                });
    }
    conexion.end();
}
//Funciones para el control de usuarios
function crearUsuario(valores,callback)
{
    if(callback===undefined)
        callback=function(){};
    if(valores!==null && valores.length===8)
    {
        query="INSERT INTO Usuarios"+
              "VALUES (null,?,?,?,?,?,?,?)";
        //Conectamos con la consulta requerida
        valoresEntrada=[valores.nick,valores.nombre,valores.apellidos,valores.contraseña,valores.fechaNac,valores.sexo,valores.imagen];
        conexion.connect(function(err) { accion(err, callback); });
    }
    else
    {
        callback(err,"Datos incorrectos");
    }
}
function conectar(nick,callback)
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
        callback(err,"Datos no validos");
    }
}
function estaConectado(ID,callback)
{
    if(ID!==null && nick==="number")
    {
        query="SELECT Logeado"+
              "FROM Usuarios"+
              "WHERE ID_usuario= ?";
        valoresEntrada=[ID];
    }
    else
    {
        callback(null);
    }
}
function modificarUsuario(ID,valores,callback)
{
    if(ID!==null && nick==="number")
    {
        if(valores!=null && valores.length===7)
        {
            query="UPDATE Usuarios"+
                  "SET  Nick=" + valores.nick +","+
                       "Nombre=" + valores.nombre +","+
                       "Apellidos="+ valores.apellidos +","+
                       "Contraseña"+ valores.contraseña +","+
                       "Fecha_Nac="+ valores.fechaNac +","+
                       "Sexo="+ valores.sexo +","+
                       "Imagen="+ valores.imagen +
                "WHERE ID_usuario= ?";
            valoresEntrada=[ID,valores.nick,valores.nombre,valores.apellidos,valores.contraseña,valores.fechaNac,valores.sexo,valores.imagen];
            //Conectamos con la consulta requerida
            conexion.connect(accion);
        }
        else
        {
            callback(null);
        }
    }
}
function desconectar(ID,callback)
{
    if(ID!==null && nick==="number")
    {
        query="UPDATE Usuarios"+
              "SET logeado = false"+
              "WHERE ID_Usuario= ?";
        valoresEntrada=[ID];
    }
    else
    {
        callback(null);
    }
}
function mostrarUsuario(ID,callback)
{
    if(ID!==null && nick==="number")
    {
        query="SELECT *"+
              "FROM Usuarios"+
              "WHERE ID_usuario= ?";
        valoresEntrada=[ID];
    }
    else
    {
        callback(null);
    }
}
//Funciones para el control de las partidas
function crearPartida(valores,callback)
{
    if(callback===undefined)
        callback=function(){};
    if(valores!==null && valores.length===6)
    {
        query="INSERT INTO Partidas"+
              "VALUES (null,?,0,?,1,?,?,null,?,?)";      
        valoresEntrada=[valores.Nombre,valores.creador,valores.numMax,valores.numTurnos,valores.numTurnos,valores.fecha];
        //Conectamos con la consulta requerida
        conexion.connect(function(err) { accion(err, callback); });
    }
    else
    {
        callback(null);
    }
}
function mostrarPartida(ID,callback)
{
    if(ID!==null && nick==="number")
    {
        query="SELECT *"+
              "FROM Partidas"+
              "WHERE ID_partida= ?";
        valoresEntrada=[ID];
        //Conectamos con la consulta requerida
        conexion.connect(function(err) { accion(err, callback); });
    }
    else
    {
        callback(null);
    }
}
function borrarPartida(ID,callback)
{
    if(ID!==null && nick==="number")
    {
        query="DELETE FROM Partidas"+
              "WHERE ID_partida= ?";
         valoresEntrada=[ID];
        //Conectamos con la consulta requerida
        conexion.connect(function(err) { accion(err, callback); });    
    }
    else
    {
        callback(null);
    }
}
//Funciones sobre la asignacion de partidas
function partidasUsuario(ID,callback)
{
    if(ID!==null && nick==="number")
    {
        query="SELECT ID_Partida,Tipo_Jugador"+
              "FROM Asignacion_Partidas"+
              "WHERE ID_Usuario= ?";
        valoresEntrada=[ID];
        //Conectamos con la consulta requerida
        conexion.connect(function(err) { accion(err, callback); }); 
    }
    else
    {
        callback(null);
    }
}
function usuariosPartida(ID,callback)
{
    if(ID!==null && nick==="number")
    {
        query="SELECT ID_Partida,Tipo_Jugador"+
              "FROM Asignacion_Partidas"+
              "WHERE ID_Partida= ?";
        valoresEntrada=[ID];
        //Conectamos con la consulta requerida
        conexion.connect(function(err) { accion(err, callback); }); 
    }
    else
    {
        callback(null);
    }
}
function borrarAsignacionPartidas(ID,callback)
{
    if(ID!==null && nick==="number")
    {
        query="DELETE FROM Asignacion_Partidas"+
              "WHERE ID_Partida= ?";
         valoresEntrada=[ID];
        //Conectamos con la consulta requerida
        conexion.connect(function(err) { accion(err, callback); });       
    }
    else
    {
        callback(null);
    }
}
function borrarUsuarioDePartida(valores,callback)
{
    if(valores!==null && valores.length===6)
    {
        query="DELETE FROM Asignacion_Partidas"+
              "WHERE ID_Partida= ?"+
              "AND ID_Usuario= ?";
        valoresEntrada=[valores.partida,valores.usuario];
       //Conectamos con la consulta requerida
       conexion.connect(function(err) { accion(err, callback); });
    }
    else
    {
        callback(null);
    }
}