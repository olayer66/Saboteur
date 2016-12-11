/* 
Creacion, modficacion y eliminacion de partidas.
 */
"use strict";
var accBBDD =require("./accesoBBDD");
var partida= {
    IDPartida:null,
    nombre:null,
    estadoPartida:null,
    creador:null,
    numJugadores:null,
    numMaxJugadores:null,
    turno:null,
    ganador:null,
    numTurnos:null,
    fechaCreacion:null   
};
var vista={
    parEnJuego:null,
    parDisponibles:null,
    parPropias:null,
    parTerminadas:null,
    parEspera:null
};
module.exports={
    crearPartida:crearPartida,
    borrarPartida:borrarPartida,
    verPartidasUsuario:verPartidasUsuario,
    quitarUsuarioPartida:quitarUsuarioPartida,
    asignarUsuarioPartida:asignarUsuarioPartida
};
function crearPartida(IDUsuario,entrada,callback)
{     
    //rellenamos el objeto de la partida
    partida.nombre=entrada.nombrePartida;
    partida.numMaxJugadores=entrada.numJugPartida;
    partida.creador=IDUsuario;
    partida.numTurnos=calculaTurnos(entrada.numJugPartida);
    if(partida.numTurnos===0)
        callback(new Error("Numero de Jugadores no comtenplado"));
    partida.fechaCreacion=calculaFecha();
    //Llamamos a la BBDD para crear la partida
    accBBDD.crearPartida(partida,function(err,salida){
        if(err)
        {
            callback(err);
        }
        else
        {            
            //Extraemos el ID de la partida creada
            partida.IDPartida=salida.insertId;
            //Asignamos al creador como primer jugador de la partida
            asignarUsuarioPartida(partida.IDPartida,partida.creador,function (err)
            {
                if(err)
                {
                    //En caso de fallo hacemos RollBack
                    borrarPartida(partida.IDPartida,function(err2)
                    {
                        if(err2)
                          callback(err2);
                        else
                          callback(err);
                    });
                }
                else
                {
                    //Creamos el tablero y lo asignamos
                    accBBDD.crearTablero(partida.IDPartida,function (err)
                    {
                        if(err)
                        {
                            //En caso de fallo hacemos RollBack
                            borrarPartida(partida.IDPartida,function(err2)
                            {
                                if(err2)
                                  callback(err2);
                                else
                                  callback(err);
                            });
                        }
                        else
                        {
                            callback(null);
                        }
                    });
              }
          });
        }
    });
}
function verPartidasUsuario(IDUsuario,callback)
{
    //Extraemos las partidas creada por el usuario
        accBBDD.partidasPropias(IDUsuario,function(err,propias){
            if(err)
            {
                 callback(err,null);
            }
            else
            {
                vista.parPropias=propias;
                //Extraemos las partidas disponibles en la que el usuario no este implicado
                accBBDD.partidasUsuarioDisponibles(IDUsuario,function(err,disponibles){
                    if(err)
                    {
                         callback(err,null);
                    }
                    else
                    {
                        vista.parDisponibles=disponibles;
                        accBBDD.partidasUsuarioTerminadas(IDUsuario,function(err,terminadas){
                        if(err)
                        {
                             callback(err,null);
                        }
                        else
                        {
                            vista.parTerminadas=terminadas;
                            accBBDD.partidasUsuarioEnJuego(IDUsuario,function(err,enJuego)
                            {
                                if(err)
                                {
                                     callback(err,null);
                                }
                                else
                                {
                                    vista.parEnJuego=enJuego;
                                    accBBDD.partidasUsuarioEnEspera(IDUsuario,function(err,enEspera){
                                        if(err)
                                        {
                                             callback(err,null);
                                        }
                                        else
                                        {
                                            vista.parEspera=enEspera;
                                            callback(null,vista);
                                        }
                                    });
                                }
                            });
                        }
                        });
                    }
                });
            }
        });
}
function borrarPartida(IDPartida,callback)
{
    //eliminamos las asignaciones de jugadores a la partida
    console.log("ID partida: " + IDPartida);
    accBBDD.borrarAsignacionPartidas(IDPartida,function(err)
    {
        console.log("ID partida 1");
        if(err)
        {
            console.log("error 1");
            callback(err);
        }
        else
        {
            //borramos el tablero asociado a la partida
            accBBDD.borrarTablero(IDPartida,function(err)
            {
                console.log("ID partida 2");
                if(err)
                {
                    console.log("error 2");
                    callback(err);
                }
                else
                {
                    //borramos la partida
                    accBBDD.borrarPartida(IDPartida,function(err)
                    {
                        console.log("ID partida 3");
                        if(err)
                        {
                            console.log("error 4");
                            callback(err);
                        }
                        else
                        {
                            callback(null);
                        }
                    }); 
                }
            }); 
        }
    });
}
//Asignacion de partidas
function asignarUsuarioPartida(IDPartida,IDUsuario,callback)
{
    accBBDD.asignarUsuarioPartida(IDPartida,IDUsuario,null,function(err){
        if(err)
        {
            callback(err);
        }
        else
        {
            accBBDD.añadirUsuarioPartida(IDPartida,function(err)
            {
                if(err)
                {
                    callback(err);
                }
                else
                {

                    callback(null);
                }
            });
        }
    });
}
function quitarUsuarioPartida(IDPartida,IDUsuario,callback)
{
    accBBDD.borrarUsuarioDePartida(IDPartida,IDUsuario,function(err){
        if(err)
        {
            callback(err);
        }
        else
        {
            accBBDD.quitarUsuarioPartida(IDPartida,function(err)
            {
                if(err)
                {
                    callback(err);
                }
                else
                {
                    callback(null);
                }
            });
        }
    });
}
function comprobarEstadoPartida(IDPartida,callback)
{
    accBBDD.devolverEstadoPartida()(IDPartida,function(err,estado){
        if(err)
        {
            callback(err,null);
        }
        else
        {
           
            callback(null,estado);
        }
    });
}
/*===================================================FUNCIONES AUXILIARES==================================================*/
function calculaTurnos(numJugadores)
{
    switch (numJugadores)
    {
        case "3":
            return 50;   
            break;
        case "4":
            return 45;
            break;
        case "5":
            return 40;
            break;
        case "6":
            return 40;
            break;
        case "7":
            return 35;
            break;
        default:
            return 0;
                    
    }
}
function calculaFecha()
{
    var fecha= new Date();
    return fecha.getDay()+"/"+fecha.getMonth()+"/"+ fecha.getFullYear();
}

