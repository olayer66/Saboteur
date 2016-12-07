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
}
module.exports={
    crearPartida:crearPartida
};
function crearPartida(IDUsuario,entrada,callback){
      
      console.log("numero jugadores"+ entrada.numJugPartida);
      //rellenamos el objeto de la partida
      partida.nombre=entrada.nombrePartida;
      partida.numMaxJugadores=entrada.numJugPartida;
      partida.creador=IDUsuario;
      partida.numTurnos=calculaTurnos(entrada.numJugPartida);
      if(partida.numTurnos===0)
          callback(new Error("Numero de Jugadores no comtenplado"),null);
      partida.fechaCreacion=calculaFecha();
      //Llamamos a la BBDD para crear la partida
      accBBDD.crearPartida(entrada,function(err,salida){
          if(err)
          {
              callback(err,null);
          }
          else
          {
              //Extraemos el ID de la partida creada
              accBBDD.devolverIDPartida(partida.nombre,function(err,salida){
                  if(err)
                  {
                      callback(err,null);
                  }
                  else
                  {
                      partida.IDPartida=salida;
                  }
              });
              //Asignamos al creador como primer jugador de la partida
              asignarUsuarioPartida(partida.creador,partida.IDPartida,function (err){
                  if(err)
                  {
                      callback(err,null);
                  }
              });
          }
      });
}
function asignarUsuarioPartida(IDUsuario,IDPartida,callback)
{
    accBBDD.asignarUsuarioPartida(IDusuario,IDPartida,null,function(err){
        if(err)
        {
            callback(err,null);
        }
    });
}
/*===================================================FUNCIONES AUXILIARES==================================================*/
function calculaTurnos(numJugadores)
{
    switch (numJugadores)
    {
        case 3:
            return 50;
            break;
        case 4:
            return 45;
            break;
        case 5:
            return 40;
            break;
        case 6:
            return 40;
            break;
        case 7:
            return 35;
            break;
        default:
            return 0;
                    
    }
}
function calculaFecha()
{
    return Date.getDay()+"/"+Date.getMonth()+"/"+ Date.getYear();
}

