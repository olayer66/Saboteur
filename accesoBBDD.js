// Conexion a la BBDD
"use strict";

var mysql = require("mysql");
var config= require("./config");
var query;
var valoresEntrada;
// Salida del modulo con todas las funciones
module.exports={
    //Usuarios
    conectar: conectar,
    crearUsuario: crearUsuario,
    modificarUsuario: modificarUsuario,
    mostrarUsuario: mostrarUsuario,
    //Partidas
    crearPartida: crearPartida,
    mostrarPartida: mostrarPartida,
    borrarPartida: borrarPartida,
    partidasPropias:partidasPropias,
    devolverIDPartida:devolverIDPartida,
    añadirUsuarioPartida:añadirUsuarioPartida,
    //Asignacion de partidas
    asignarUsuarioPartida:asignarUsuarioPartida,
    partidasUsuarioDisponibles:partidasUsuarioDisponibles,
    partidasUsuarioTerminadas:partidasUsuarioTerminadas,
    partidasUsuarioEnJuego:partidasUsuarioEnJuego,
    usuariosPartida:usuariosPartida,
    borrarAsignacionPartidas:borrarAsignacionPartidas,
    borrarUsuarioDePartida:borrarUsuarioDePartida
    //tableros
    
};
//Funciones para el control de usuarios
function crearUsuario(valores,callback)
{
    var conexion = mysql.createConnection(config.conexionBBDD);
    if(callback===undefined)
        callback=function(){};
    query="INSERT INTO Usuarios(Nick,Nombre,Apellidos,Contraseña,Fecha_Nac,Sexo,Imagen)"+
          "VALUES (?,?,?,?,?,?,?)";
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
                    conexion.end();
                }
            });
        }      
    });
}
function conectar(datos,callback)
{
    var conexion = mysql.createConnection(config.conexionBBDD);
    query="SELECT ID_usuario FROM usuarios WHERE Nick=? AND Contraseña=?";
    valoresEntrada=[datos.nickLog,datos.contraLog];
    //Conectamos con la consulta requerida
    handleDisconnect(conexion);
    conexion.connect(function(err)
    {
        if (err) 
        {
            console.error(err);
            callback(err,null);
        } 
        else 
        {
            conexion.query(mysql.format(query,valoresEntrada),function(err, rows) 
            {
                if (err) 
                {
                    console.error(err);
                    callback(err,null);
                } 
                else 
                {
                    callback(null,rows[0].ID_usuario);
                    conexion.end();
                }
            }); 
        }    
    });
}
function modificarUsuario(IDUsuario,valores,callback)
{
    var conexion = mysql.createConnection(config.conexionBBDD);
    if(IDUsuario!==null && typeof(IDUsuario)==="number")
    {
        if(valores!==null)
        {
            query="UPDATE Usuarios"+
                  "SET  Nick=?, Nombre=?, Apellidos=?, Contraseña=?, Fecha_Nac=?, Sexo=?, Imagen=?" +
                  "WHERE ID_usuario= ?";
            valoresEntrada=[valores.nick,valores.nombre,valores.apellidos,valores.contraseña,valores.fechaNac,valores.sexo,valores.imagen,IDUsuario];
            //Conectamos con la consulta requerida
            conexion.query(mysql.format(query,valoresEntrada),function(err, rows) 
            {
                if (err) 
                {
                    console.error(err);
                    callback(err,null);
                } 
                else 
                {
                    console.log("Row del usuario:\n"+rows[0]);
                    //callback(null,rows[0].ID_usuario);
                    conexion.end();
                }
            });
        }
        else
        {
            callback(null);
        }
    }
}
function mostrarUsuario(ID,callback)
{
    var conexion = mysql.createConnection(config.conexionBBDD);
    if(ID!==null && typeof(ID)==="number")
    {
        query="SELECT * FROM Usuarios WHERE ID_usuario=?";
        valoresEntrada=[ID];
         //Conectamos con la consulta requerida
        conexion.query(mysql.format(query,valoresEntrada),function(err, rows) 
        {
            if (err) 
            {
                console.error(err);
                callback(err,null);
            } 
            else 
            {
                callback(null,rows);
                conexion.end();
            }
        });
    }
    else
    {
        callback(null);
    }
}
//Funciones para el control de las partidas
function crearPartida(valores,callback)
{
    var conexion = mysql.createConnection(config.conexionBBDD);
    if(callback===undefined)
        callback=function(){};
    if(valores!==null)
    {
        query="INSERT INTO Partidas(Nombre,Creador,Num_Max_Jugadores,Num_turnos,Fecha_Creacion)"+
              "VALUES (?,?,?,?,?)";      
        valoresEntrada=[valores.nombre,valores.creador,valores.numMaxJugadores,valores.numTurnos,valores.fechaCreacion];
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
                conexion.query(mysql.format(query,valoresEntrada),function(err, rows) 
                {
                    if (err) 
                    {
                        console.error(err);
                        callback(err,null);
                    } 
                    else 
                    {
                        callback(null,rows);
                        conexion.end();
                    }
                });
            }   
        });
    }
    else
    {
        callback(null);
    }
}
function devolverIDPartida(nombre,callback)
{
    console.log("Nombre: "+nombre);
    var conexion = mysql.createConnection(config.conexionBBDD);
    query='SELECT ID_partida FROM Partidas WHERE Nombre=?';
    valoresEntrada=[nombre];
    handleDisconnect(conexion);
    //Conectamos con la consulta requerida
    console.log(mysql.format(query,valoresEntrada));
    conexion.connect(function(err)
    {
        if (err) 
        {
            console.error(err);
            callback(err,null);
        } 
        else 
        {
            conexion.query(mysql.format(query,valoresEntrada),function(err, rows) 
            {
                if (err) 
                {
                    console.error(err);
                    callback(err,null);
                } 
                else 
                {
                    console.log("accBBDD: "+rows[0].ID_Partida);
                    callback(null,rows[0].ID_Partida);
                }
            });
        }
        conexion.end();
    });
}
function mostrarPartida(ID,callback)
{
    var conexion = mysql.createConnection(config.conexionBBDD);
    if(ID!==null && typeof(ID)==="number")
    {
        query="SELECT * FROM Partidas WHERE ID_partida= ?";
        valoresEntrada=[ID];
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
            conexion.query(mysql.format(query,valoresEntrada),function(err, rows) 
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
        callback(new Error("El ID de partida no es valido"),null);
    }
}
function borrarPartida(ID,callback)
{
    var conexion = mysql.createConnection(config.conexionBBDD);
    if(ID!==null && typeof(ID)!=="number")
    {
        query="DELETE FROM Partidas WHERE ID_partida= ?";
         valoresEntrada=[ID];
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
            conexion.query(mysql.format(query,valoresEntrada),function(err, rows) 
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
        callback(new Error("El ID de partida no es valido"),null);
    }
}
function partidasPropias(ID,callback)
{
    var conexion = mysql.createConnection(config.conexionBBDD);
    if(ID!==null)
    {
        query="SELECT * FROM partidas WHERE Creador=?";
        valoresEntrada=[ID];
        //Conectamos con la consulta requerida
        console.log(mysql.format(query,valoresEntrada));
        handleDisconnect(conexion);
        conexion.connect(function(err)
        {
            if (err) 
            {
                console.error(err);
                callback(err,null);
            } 
            else 
            {
                conexion.query(mysql.format(query,valoresEntrada),function(err, rows) 
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
        callback(new Error("ID de usuario no valido"),null);
    }
}
function añadirUsuarioPartida(ID,callback)
{
   var conexion = mysql.createConnection(config.conexionBBDD);
    if(ID!==null && typeof(ID)==="number")
    {
        query="UPDATE partidas SET Num_Jugadores=Num_jugadores+1 WHERE ID_partida= ?";
        valoresEntrada=[ID];
        //Conectamos con la consulta requerida
        conexion.query(mysql.format(query,valoresEntrada),function(err) 
        {
            if (err) 
            {
                console.error(err);
                callback(err);
            } 
            else 
            {
                callback(null);
                conexion.end();
            }
        });
    }
} 
//Funciones sobre la asignacion de partidas
function asignarUsuarioPartida(IDPartida,IDUsuario,Roll,callback)
{
    var conexion = mysql.createConnection(config.conexionBBDD);
    if(IDUsuario!==null && typeof (IDUsuario)==="number" && IDPartida!==null && typeof (IDPartida)==="number")
    {
        query="INSERT INTO Asignacion_Partidas(ID_Partida,ID_Usuario,Tipo_Jugador)"+
              "VALUES (?,?,?)";      
        valoresEntrada=[IDPartida,IDUsuario,Roll];
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
            conexion.query(mysql.format(query,valoresEntrada),function(err, rows) 
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
        callback(new Error("Valores de entrada no validos"),null);
    }
}
function partidasUsuarioDisponibles(ID,callback)
{
    var conexion = mysql.createConnection(config.conexionBBDD);
    if(ID!==null && typeof(ID)==="number")
    {
        query="SELECT B.* FROM Asignacion_Partidas AS A, Partidas AS B WHERE A.ID_Usuario<> ? AND A.ID_Partida=B.ID_Partida AND B.Estado_Partida=0";
        valoresEntrada=[ID];
        
        //Conectamos con la consulta requerida
        handleDisconnect(conexion);
        conexion.connect(function(err)
        {
            if (err) 
            {
                console.error(err);
                callback(err,null);
            } 
            else 
            {
                conexion.query(mysql.format(query,valoresEntrada),function(err, rows) 
                {
                    if (err) 
                    {
                        console.error(err);
                        callback(err,null);
                    } 
                    else 
                    {
                        callback(null,rows);
                        conexion.end();
                    }
                });
            }      
        }); 
    }
    else
    {
        callback(new Error("El ID de usuario no es valido"),null);
    }
}
function partidasUsuarioTerminadas(ID,callback)
{
    var conexion = mysql.createConnection(config.conexionBBDD);
    if(ID!==null && typeof(ID)==="number")
    {
        query="SELECT B.* FROM Asignacion_Partidas AS A, Partidas AS B WHERE A.ID_Usuario<> ? AND A.ID_Partida=B.ID_Partida AND B.Estado_Partida=2";
        valoresEntrada=[ID];
        
        //Conectamos con la consulta requerida
        handleDisconnect(conexion);
        conexion.connect(function(err)
        {
            if (err) 
            {
                console.error(err);
                callback(err,null);
            } 
            else 
            {
                conexion.query(mysql.format(query,valoresEntrada),function(err, rows) 
                {
                    if (err) 
                    {
                        console.error(err);
                        callback(err,null);
                    } 
                    else 
                    {
                        callback(null,rows);
                        conexion.end();
                    }
                });
            }      
        }); 
    }
    else
    {
        callback(new Error("El ID de usuario no es valido"),null);
    }
}
function partidasUsuarioEnJuego(ID,callback)
{
    var conexion = mysql.createConnection(config.conexionBBDD);
    if(ID!==null && typeof(ID)==="number")
    {
        query="SELECT B.* FROM Asignacion_Partidas AS A, Partidas AS B WHERE A.ID_Usuario<> ? AND A.ID_Partida=B.ID_Partida AND B.Estado_Partida=1";
        valoresEntrada=[ID];
        
        //Conectamos con la consulta requerida
        handleDisconnect(conexion);
        conexion.connect(function(err)
        {
            if (err) 
            {
                console.error(err);
                callback(err,null);
            } 
            else 
            {
                conexion.query(mysql.format(query,valoresEntrada),function(err, rows) 
                {
                    if (err) 
                    {
                        console.error(err);
                        callback(err,null);
                    } 
                    else 
                    {
                        callback(null,rows);
                        conexion.end();
                    }
                });
            }      
        }); 
    }
    else
    {
        callback(new Error("El ID de usuario no es valido"),null);
    }
}
function usuariosPartida(ID,callback)
{
    var conexion = mysql.createConnection(config.conexionBBDD);
    if(ID!==null && typeof(ID)==="number")
    {
        query="SELECT ID_Partida,Tipo_Jugador"+
              "FROM Asignacion_Partidas"+
              "WHERE ID_Partida= ?";
        valoresEntrada=[ID];
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
        callback(new Error("El ID de partida no es valido"),null);
    }
}
function borrarAsignacionPartidas(ID,callback)
{
    var conexion = mysql.createConnection(config.conexionBBDD);
    if(ID!==null && typeof(ID)==="number")
    {
        query="DELETE FROM Asignacion_Partidas"+
              "WHERE ID_Partida= ?";
         valoresEntrada=[ID];
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
        callback(new Error("El ID de partida no es valido"),null);
    }
}
function borrarUsuarioDePartida(valores,callback)
{
    var conexion = mysql.createConnection(config.conexionBBDD);
    if(valores!==null)
    {
        query="DELETE FROM Asignacion_Partidas WHERE ID_Partida=? AND ID_Usuario= ?";
        valoresEntrada=[valores.partida,valores.usuario];
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
            conexion.query(mysql.format(query,valoresEntrada),function(err, rows) 
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
        callback(new Error("Alguno de los ID no es valido"),null);
    }
}
/*===========================CONTROL DE CONEXION==========================================================*/
function handleDisconnect(connection) {
  connection.on('error', function(err) {
    if (!err.fatal) {
      return;
    }

    if (err.code !== 'PROTOCOL_CONNECTION_LOST') {
      throw err;
    }

    console.log('Re-connecting lost connection: ' + err.stack);

    connection = mysql.createConnection(connection.config);
    handleDisconnect(connection);
    connection.connect();
  });
}