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
    quitarUsuarioPartida:quitarUsuarioPartida,
    cambiarEstadoPartida:cambiarEstadoPartida,
    devolverTurnosPartida:devolverTurnosPartida,
    //Asignacion de partidas
    asignarUsuarioPartida:asignarUsuarioPartida,
    partidasUsuarioDisponibles:partidasUsuarioDisponibles,
    partidasUsuarioTerminadas:partidasUsuarioTerminadas,
    partidasUsuarioEnJuego:partidasUsuarioEnJuego,
    usuariosPartida:usuariosPartida,
    borrarAsignacionPartidas:borrarAsignacionPartidas,
    borrarUsuarioDePartida:borrarUsuarioDePartida,
    añadirNuevaMano:añadirNuevaMano,
    añadirCartaMano:añadirCartaMano,
    //tableros
    crearTablero:crearTablero,
    borrarTablero:borrarTablero,
    sacarTablero:sacarTablero,
    añadirCartaTablero:añadirCartaTablero,
    devolverCartaTablero:devolverCartaTablero
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
function quitarUsuarioPartida(ID,callback)
{
   var conexion = mysql.createConnection(config.conexionBBDD);
    if(ID!==null && typeof(ID)==="number")
    {
        query="UPDATE partidas SET Num_Jugadores=Num_jugadores-1 WHERE ID_partida= ?";
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
function cambiarEstadoPartida(ID,estado,callback)
{
   var conexion = mysql.createConnection(config.conexionBBDD);
    if(ID!==null && typeof(ID)==="number")
    {
        query="UPDATE partidas SET Estado_Partida=? WHERE ID_partida= ?";
        valoresEntrada=[estado,ID];
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
function devolverTurnosPartida(ID,callback)
{
    var conexion = mysql.createConnection(config.conexionBBDD);
    if(ID!==null && typeof(ID)==="number")
    {
        query="SELECT Turnos,num_Turnos FROM Partidas WHERE ID_partida= ?";
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
        query="SELECT ID_Partida,Tipo_Jugador FROM Asignacion_Partidas WHERE ID_Partida= ?";
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
function borrarAsignacionPartidas(ID,callback)
{
    var conexion = mysql.createConnection(config.conexionBBDD);
    if(ID!==null && typeof(ID)==="number")
    {
        query="DELETE FROM Asignacion_Partidas WHERE ID_Partida= ?";
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
function borrarUsuarioDePartida(IDPartida,IDUsuario,callback)
{
    var conexion = mysql.createConnection(config.conexionBBDD);
    if(IDPartida!==null && typeof(IDPartida)==="number")
    {
        if(IDUsuario!==null && typeof(IDUsuario)==="number")
        {
            query="DELETE FROM Asignacion_Partidas WHERE ID_Partida=? AND ID_Usuario= ?";
            valoresEntrada=[IDPartida,IDUsuario];
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
                        }
                    });
                }
                conexion.end();
            });
        }
        else
        {
            callback(new Error("El ID de usuario no es valido"));
        }
    }
    else
    {
        callback(new Error("El ID de partida no es valido"));
    }
}
function añadirNuevaMano(IDPartida,IDUsuario,cartas,callback)
{
    var conexion = mysql.createConnection(config.conexionBBDD);
    if(IDPartida!==null && typeof(IDPartida)==="number")
    {
        if(IDUsuario!==null && typeof(IDUsuario)==="number")
        {
            if(cartas!==null)
            {
                query="UPDATE asginacion_partidas SET  mano1=? mano2=? mano3=? mano4=? mano5=? mano6=? WHERE ID_Partida=? AND ID_Usuario=?";
                valoresEntrada=[cartas.mano1,cartas.mano2,cartas.mano3,cartas.mano4,cartas.mano5,cartas.mano6,IDPartida,IDUsuario];
                //Conectamos con la consulta requerida
                conexion.query(mysql.format(query,valoresEntrada),function(err, rows) 
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
            else
            {
                callback(new Error("La carta no es valida"));
            }
        }
        else
        {
            callback(new Error("La ID de usuario no es valido"));
        }
    }
    else
    {
        callback(new Error("La ID de partida no es valido"));
    }
}
function añadirCartaMano(IDPartida,IDUsuario,carta,callback)
{
    var conexion = mysql.createConnection(config.conexionBBDD);
    if(IDPartida!==null && typeof(IDPartida)==="number")
    {
        if(IDUsuario!==null && typeof(IDUsuario)==="number")
        {
            if(carta!==null)
            {
                query="UPDATE asginacion_partidas SET  ?=? WHERE ID_Partida=? AND ID_Usuario=?";
                valoresEntrada=[carta.posicion,carta.tipo,IDPartida,IDUsuario];
                //Conectamos con la consulta requerida
                conexion.query(mysql.format(query,valoresEntrada),function(err, rows) 
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
            else
            {
                callback(new Error("La carta no es valida"));
            }
        }
        else
        {
            callback(new Error("La ID de usuario no es valido"));
        }
    }
    else
    {
        callback(new Error("La ID de partida no es valido"));
    }
}
//Funciones para tableros
function crearTablero(IDPartida,callback)
{
    var conexion = mysql.createConnection(config.conexionBBDD);
    if(callback===undefined)
        callback=function(){};
    if(IDPartida!==null && typeof(IDPartida)==="number")
    {
        query="INSERT INTO tableros(ID_Partida)"+
              "VALUES (?)";      
        valoresEntrada=[IDPartida];
        //Conectamos con la consulta requerida
        conexion.connect(function(err)
        {
            console.log("tablero1");
            if (err) 
            {
                console.log("tablero2");
                console.error(err);
                callback(err);
            } 
            else 
            {
                conexion.query(mysql.format(query,valoresEntrada),function(err) 
                {
                    if (err) 
                    {
                        console.log("tablero3");
                        console.error(err);
                        callback(err);
                    } 
                    else 
                    {
                        console.log("tablero4");
                        callback(null);
                        conexion.end();
                    }
                });
            }   
        });
    }
    else
    {
        callback(new Error("El ID de partida no es valido"));
    }
}
function borrarTablero(IDPartida,callback)
{
    var conexion = mysql.createConnection(config.conexionBBDD);
    if(IDPartida!==null && typeof(IDPartida)==="number")
    {
        query="DELETE FROM tablero WHERE ID_Partida= ?";
         valoresEntrada=[IDPartida];
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
function sacarTablero(ID,callback)
{
    var conexion = mysql.createConnection(config.conexionBBDD);
    if(ID!==null && typeof(ID)==="number")
    {
        query="SELECT * FROM tableros WHERE ID_Partida= ?";
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
function añadirCartaTablero(IDPartida,carta,callback)
{
    var conexion = mysql.createConnection(config.conexionBBDD);
    if(IDPartida!==null && typeof(IDPartida)==="number")
    {
        if(carta!==null)
        {
            query="UPDATE tableros SET  ?=? WHERE ID_Partida= ?";
            valoresEntrada=[carta.posicion,carta.tipo,IDPartida];
            //Conectamos con la consulta requerida
            conexion.query(mysql.format(query,valoresEntrada),function(err, rows) 
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
        else
        {
            callback(new Error("La carta no es valida"));
        }
    }
    else
    {
        callback(new Error("La ID de partida no es valido"));
    }
}
function devolverCartaTablero(IDPartida,posicion,callback)
{
    var conexion = mysql.createConnection(config.conexionBBDD);
    if(IDPartida!==null && typeof(IDPartida)==="number")
    {
        if(posicion!==null)
        {
            query="SELECT ? FROM tableros WHERE ID_Partida= ?";
            valoresEntrada=[posicion,IDPartida];
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
            callback(new Error("La posicion no es valida"),null);
        }
    }
    else
    {
        callback(new Error("La ID de partida no es valido"));
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