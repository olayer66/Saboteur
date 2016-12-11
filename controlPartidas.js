/* 
Creacion, modficacion y eliminacion de partidas.
 */
"use strict";
var _ = require("underscore");
var accBBDD =require("./accesoBBDD");
var cartas= require("./cartas");
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
        accBBDD.partidasPropias(IDUsuario,function(err,propias)
        {
            if(err)
            {
                 callback(err,null);
            }
            else
            {
                vista.parPropias=propias;
                //Extraemos las partidas disponibles en la que el usuario no este implicado
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
                                    partidasDisponibles(IDUsuario,function(err,parDisponibles){
                                        if(err)
                                        {
                                            callback(err,null);
                                        }
                                        else
                                        {
                                            vista.parDisponibles=parDisponibles;
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
                    accBBDD.devolverJugadoresPartida(IDPartida,function(err,salida)
                    {
                        if(err)
                        {
                            callback(err);
                        }
                        else
                        {
                            console.log("llego aqui:"+IDPartida);
                            console.log("llego aqui 2:"+salida[0].Num_Jugadores+"   "+salida[0].Num_Max_Jugadores);
                            if(salida[0].Num_Jugadores===salida[0].Num_Max_Jugadores)
                            {
                                console.log("llego aqui 3");
                                generarPartida(IDPartida,salida[0].Num_Max_Jugadores,function (err){
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
                            else
                            {
                                callback(null);
                            }
                        }
                    });        
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
function generarTurnos(numJugadores)
{
    console.log("turnos numero:"+numJugadores);
    switch (numJugadores)
    {
        case "3":
            return _.shuffle([1,2,3]);   
            break;
        case "4":
            return _.shuffle([1,2,3,4]);
            break;
        case "5":
            return _.shuffle([1,2,3,4,5]);
            break;
        case "6":
            return _.shuffle([1,2,3,4,5,6]);
            break;
        case "7":
            return _.shuffle([1,2,3,4,5,6,7]);
            break;
        default:
            return null;
                    
    }
}
function generarTipos(numJugadores)
{
    console.log("tipos numero:"+numJugadores);
    switch (numJugadores)
    {
        case "3":
            return _.shuffle(["S","B","B"]);   
            break;
        case "4":
            return _.shuffle(["S","B","B","B"]);   
            break;
        case "5":
            return _.shuffle(["S","S","B","B","B"]);   
            break;
        case "6":
            return _.shuffle(["S","S","B","B","B","B"]);   
            break;
        case "7":
            return _.shuffle(["S","S","B","B","B","B","B"]);   
            break;
        default:
            return null;
                    
    }
}
function calculaFecha()
{
    var fecha= new Date();
    return fecha.getDay()+"/"+fecha.getMonth()+"/"+ fecha.getFullYear();
}
/*
 * Generar un numero N de cartas aleatorias para la mano 
    * 5 o 6 para el inicio de la partida(depende del numero de jugadores)
    * 1 para el descarte del jugador
 */
function generarCartasAleatorias(numCartas)
{
    console.log("Num Cartas:"+cartas.piezasJuego[0].nombre);
    return _.sample(cartasJuego,numCartas);
}
//Genera una posicion aleatoria para la pepita
function generarPepitaOro()
{
    
    var pepita=_.sample([0,1,2], 1);
    console.log("Pepita: "+pepita);
    var salida=[];
    for(var i=0;i<3;i++)
    {
        if (i===pepita)
            salida.push("Gold");
        else
          salida.push("NoGold");  
    }
    return salida;
}
//Generador De partidas
function generarPartida(IDPartida,numJugadores,callback)
{   
    //introducir casillas
    accBBDD.generarTablero(IDPartida,generarPepitaOro(),function(err)
    {
        console.log("paso 1");
        if(err)
        {
            callback(err);
        }
        else
        {
            //generar lista de turnos
            generarDatosJugador(IDPartida,numJugadores,function(err){
                console.log("paso 2");
                if(err)
                {
                    callback(err);
                }
                else
                {
                    //cambiar estado de la partida a 1
                    accBBDD.cambiarEstadoPartida(IDPartida,1,function(err){
                        console.log("paso 3");
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
    });
    
}
function generarDatosJugador(IDPartida,numJugadores,callback)
{
    var pos=0;
    accBBDD.usuariosPartida(IDPartida,function(err,jugadores){
        if(err)
        {
            callback(err,null);
        }
        else
        {
            console.log(jugadores);
            jugadores.forEach(function(jugador){
                var cartas=generarCartasAleatorias(numJugadores);
                var turnos=generarTurnos(numJugadores);
                var tipo=generarTipos(numJugadores);
                console.log("cartas: "+cartas);
                console.log("turnos: "+turnos);
                console.log("tipos: "+tipo);
                accBBDD.añadirVariablesJugador(IDPartida,jugador.ID_Usuario,tipo[pos],turnos[pos],cartas,function(err)
                {
                    if(err)
                    {
                        callback(err,null);
                    }
                });
                pos++;
            });
        }
    });
}
function partidasDisponibles(IDUsuario,callback)
{
    accBBDD.partidasUsuarioIguales(IDUsuario,function(err,iguales){
        if(err)
        {
            callback(err,null);
        }
        else
        {
            accBBDD.partidasUsuarioNoIguales(IDUsuario,function(err,noIguales){
                if(err)
                {
                    callback(err,null);
                }
                else
                {
                    /*console.log(noIguales);
                     console.log("==============================");
                      console.log(iguales);*/
                    callback(null,_.difference(noIguales,iguales));
                }
            });
        }
    });
}
