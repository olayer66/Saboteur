// Conexion a la BBDD
"use strict";

var mysql = require("mysql");
var query;
var valoresEntrada;
var conexion = mysql.createConnection({
    port:"3306",
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
        callback(err,null);
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
    console.log(valores);
    if(callback===undefined)
        callback=function(){};
    query="INSERT INTO Usuarios(Nick,Nombre,Apellidos,Contraseña,Fecha_Nac,Sexo,Imagen,Logeado)"+
          "VALUES (?,?,?,?,?,?,?,false)";
    valoresEntrada=[valores.nick,valores.nombre,valores.apellidos,valores.contra,valores.fechaNac,valores.sexo,valores.imgPerfil];
    //Conectamos con la consulta requerida
    conexion.connect(function(err)
    {
        if (err) 
        {
            console.error(err);
            callback(err,null);
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
    });
}
function conectar(datos,callback)
{
    if(nick!==null && typeof(nick)==="String")
    {
    query="SELECT Nick " + 
          "FROM Usuarios"+
          "WHERE Nick= ? AND Contraseña= ?";
    valoresEntrada=[datos.nick,datos.contra];
    //Conectamos con la consulta requerida
    conexion.connect(function(err)
    {
        if (err) 
        {
            console.error(err);
            callback(err,null);
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
    });
    }
    else
    {
        callback(err,false);
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
        if(valores!=null)
        {
            query="UPDATE Usuarios"+
                  "SET  Nick=?, Nombre=?, Apellidos=?, Contraseña=?, Fecha_Nac=?, Sexo=?, Imagen=?" +
                  "WHERE ID_usuario= ?";
            valoresEntrada=[valores.nick,valores.nombre,valores.apellidos,valores.contraseña,valores.fechaNac,valores.sexo,valores.imagen,IDUsuario];
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
    if(valores!==null)
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
    if(valores!==null)
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