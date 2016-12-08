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
    parTerminadas:null
};
module.exports={
    crearPartida:crearPartida,
    verPartidasUsuario:verPartidasUsuario
};
function crearPartida(IDUsuario,entrada,callback){
      
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
              console.log("ID partida: "+partida.IDPartida);
              asignarUsuarioPartida(partida.IDPartida,partida.creador,function (err){
                  if(err)
                  {
                      callback(err);
                  }
                  else
                  {
                      console.log("partida creada y asignada");
                      callback(null);
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
                            accBBDD.partidasUsuarioEnJuego(IDUsuario,function(err,enJuego){
                                if(err)
                                {
                                     callback(err,null);
                                }
                                else
                                {
                                    vista.parEnJuego=enJuego;
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

