/* 
Creacion, modficacion y eliminacion de partidas.
 */
"use strict";
var _ = require("underscore");
var accBBDD =require("./accesoBBDD");
var cartasJuego= require("./cartasjuego");
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
    mostrarPartida:mostrarPartida,
    quitarUsuarioPartida:quitarUsuarioPartida,
    asignarUsuarioPartida:asignarUsuarioPartida,
    pasarTurno:pasarTurno,
    descartar:descartar
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
                   
                     callback(null);
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
                    partidasEnJuego(IDUsuario,function(err,enJuego)
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
    accBBDD.borrarAsignacionPartidas(IDPartida,function(err)
    {
        if(err)
        {
            callback(err);
        }
        else
        {         
            //borramos la partida
            accBBDD.borrarPartida(IDPartida,function(err)
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
                            if(salida[0].Num_Jugadores===salida[0].Num_Max_Jugadores)
                            {
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
function mostrarPartida(IDPartida,IDUsuario,callback)
{
    //Sacar tablero
    extraerTablero(IDPartida,function(err,tablero){
        if(err)
        {
            callback(err);
        }
        else
        {
            //sacar jugadores
            extraerJugadores(IDPartida,function (err,jugadores){
                if(err)
                {
                    callback(err,null);
                }
                else
                {
                    //sacar turnos de partida y turno actual
                    extraerTurnos(IDPartida,jugadores,function(err,turno,maxTurnos,turnoActual){
                        if(err)
                        {
                            callback(err,null);
                        }
                        else
                        {
                            //Sacar mano del jugador
                            extraerManoJugador(IDPartida,IDUsuario,jugadores.length,function(err,mano){
                                if(err)
                                {
                                    callback(err,null);
                                }
                                else
                                {
                                    callback(null, tablero, jugadores, mano, turnoActual, turno,maxTurnos);
                                }
                            });
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
//Funciones de Juego
//El error es 0 para errores fatales el error es 1 para errores de partida
function pasarTurno(IDPartida,IDUsuario,cartaUsada,callback)
{
    var turno;
    //Estraemos los datos del turno
    accBBDD.devolverTurnosPartida(IDPartida,function(err,salida){
        if(err)
        {
            callback(err,0);
        }
        else
        {
            //comprobar si esta en la partida y es su turno
            accBBDD.usuarioEstaPartida(IDPartida,IDUsuario,function(err,datos){
                if(err)
                {
                    callback(err,0);
                }
                else
                {
                    if(datos[0]===undefined)
                    {
                        callback(new Error("No puedes jugar esta partida"),1);
                    }
                    else if(datos[0].Pos_Turno!==salida[0].Turno_juego)
                    {
                        callback(new Error("No es tu turno"),1);
                    }
                    else
                    {
                        //Comprobar si no quedan turnos
                        if((salida[0].Turno +1)>salida[0].Num_turnos)
                        {

                            //Llamamos a finalizar partida
                            finalizarPartida(IDPartida,"S",function(err){
                                if(err)
                                {
                                    callback(err,0);
                                }
                                else
                                {
                                    callback(null);
                                }
                            });
                        }
                        else
                        {
                            //calculamos el turno siguiente
                            if((salida[0].Turno_juego+1)>salida[0].Num_Max_Jugadores)
                                turno=1;
                            else
                                turno=salida[0].Turno_juego+1;
                            //Sumanos turno y cambiamos el turno al siguiente jugador
                            accBBDD.sumarTurnoPartida(IDPartida,turno,function(err){
                                if(err)
                                {
                                    callback(err);
                                }
                                else
                                {
                                    //Eliminar carta usada y sustituir por otra
                                    CambiarCarta(IDPartida,IDUsuario,cartaUsada,generarCartasAleatorias(1),function(err){
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
                    }
                }
            });
        }
    });           
}
//Descarta la seleccion del usuario y genera una nueva carta
function descartar(IDPartida,IDUsuario,cartaUsada,callback)
{
    
}
/*===================================================FUNCIONES AUXILIARES==================================================*/
//Extrae el numerod e turnos de la partida dependiendo del numero de usuarios
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
//Devuelve un array aleatorio con el turno a asignar al jugador en la partida dependiendo del numero de usuarios
function generarTurnos(numJugadores)
{
    switch (numJugadores)
    {
        case 3:
            return _.shuffle([1,2,3]);   
            break;
        case 4:
            return _.shuffle([1,2,3,4]);
            break;
        case 5:
            return _.shuffle([1,2,3,4,5]);
            break;
        case 6:
            return _.shuffle([1,2,3,4,5,6]);
            break;
        case 7:
            return _.shuffle([1,2,3,4,5,6,7]);
            break;
        default:
            return null;
                    
    }
}
//Devuelve un array aleatorio con el tipo de usuario (Saboteador o Buscador) a asignar al jugador en la partida dependiendo del numero de usuarios
function generarTipos(numJugadores)
{
    switch (numJugadores)
    {
        case 3:
            return _.shuffle(["S","B","B"]);   
            break;
        case 4:
            return _.shuffle(["S","B","B","B"]);   
            break;
        case 5:
            return _.shuffle(["S","S","B","B","B"]);   
            break;
        case 6:
            return _.shuffle(["S","S","B","B","B","B"]);   
            break;
        case 7:
            return _.shuffle(["S","S","B","B","B","B","B"]);   
            break;
        default:
            return null;
                    
    }
}
//Extrae la fecha actual
function calculaFecha()
{
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();

    if(dd<10) {
        dd='0'+dd;
    } 

    if(mm<10) {
        mm='0'+mm;
    } 
    today = dd+'/'+mm+'/'+yyyy;
    return today;
}
/*
 * Generar un numero N de cartas aleatorias para la mano 
    * 5 o 6 para el inicio de la partida(depende del numero de jugadores)
    * 1 para el descarte del jugador y al añadirla al tablero
 */
function generarCartasAleatorias(numCartas)
{
    return _.sample([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14],numCartas);
}
//Genera una posicion aleatoria para la pepita
function generarPepitaOro()
{
    
    var pepita=_.sample([0,1,2], 1);
    var salida=[];
    for(var i=0;i<3;i++)
    {
        //NO TOCAR EL == (Si pones === falla)
        if (i==pepita)
            salida.push(16);
        else
            salida.push(17);  
    }
    return salida;
}
//Generador De partidas
function generarPartida(IDPartida,numJugadores,callback)
{   
    //introducir casillas
    accBBDD.insertarPiezasIniciales(IDPartida,generarPepitaOro(),function(err)
    {
        console.log("paso 1");
        if(err)
        {
            console.log("paso 2");
            callback(err);
        }
        else
        {
            //generar lista de turnos
            console.log("paso 3");
            generarDatosJugador(IDPartida,numJugadores,function(err){          
                if(err)
                {   
                    console.log("paso 4");
                    callback(err);
                }
                else
                {
                    console.log("paso 5");
                    //cambiar estado de la partida a 1
                    accBBDD.cambiarEstadoPartida(IDPartida,1,function(err){
                        if(err)
                        {
                            console.log("paso 6");
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
    var cartas;
    console.log("paso 31");
    accBBDD.usuariosPartida(IDPartida,function(err,jugadores){
        if(err)
        {
            console.log("paso 32");
            callback(err);
        }
        else
        {                
            console.log("paso 33");
            var turnos=generarTurnos(numJugadores);
            var tipo=generarTipos(numJugadores);
            console.log("paso 34");
            jugadores.forEach(function(jugador){
                if(numJugadores>5)
                    cartas=generarCartasAleatorias(5);
                else
                    cartas=generarCartasAleatorias(6);
                accBBDD.añadirVariablesJugador(IDPartida,jugador.ID_Usuario,numJugadores,tipo[pos],turnos[pos],cartas,function(err)
                {
                    if(err)
                    {
                        console.log("paso 35");
                        callback(err);
                    }
                });
                pos++;
            });
            callback(null);
        }
    });
}
// Metodo para la finalizacion de una partida
function finalizarPartida(IDPartida,ganador,callback)
{
    //Insertar ganador y cambiar el estado de la partida a finalizada(2)
    accBBDD.finalizarPartida(IDPartida,ganador,function(err){
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
// Cambia una carta del jugador ya sea por descarte o por haber sido usada
function CambiarCarta(IDPartida,IDUsuario,cartaUsada,callback)
{
    accBBDD.añadirCartaMano(IDPartida,IDUsuario,cartaUsada,generarCartasAleatorias(1),function(err){
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
//Extrae el tablero de la BBDD
function extraerTablero(IDPartida,callback)
{
    var tablero=[];
    accBBDD.extraerPiezas(IDPartida,function (err,piezas){
        if(err)
        {
            callback(err,null);
        }
        else
        {
            piezas.forEach(function(pieza){
                tablero[pieza.Pos_Pieza]=cartasJuego[pieza.Tipo_Pieza];
                tablero[pieza.Pos_Pieza].Propierario=pieza.Propietario;
            });
            callback(null,tablero);
        }
    });
}
//Extrae los datos de los jugadores asociados a una partida
function extraerJugadores(IDPartida,callback)
{
    accBBDD.extraerUsuariosPartida(IDPartida,function(err,usuarios){
        if(err)
        {
            callback(err,null);
        }
        else
        {
            callback(null,usuarios);
        }
    });
}
//Extrae los datos relativos a los turnos de la partida y el poseedor del turno
function extraerTurnos(IDPartida,jugadores,callback)
{
    var nick;
    accBBDD.devolverTurnosPartida(IDPartida,function(err,salida){
        if(err)
        {
            callback(err,null,null,null);
        }
        else
        {
            jugadores.forEach(function (jugador){
                if(jugador.Pos_turno===salida[0].Turno_juego)
                    nick=jugador.Nick;
            });
            callback(null,salida[0].Turno,salida[0].Num_turnos,nick);
        }
    });
}
//Extrae la mano aleatoria del jugador
function extraerManoJugador(IDPartida,IDUsuario,numJugadores,callback)
{
    var mano=[];
    accBBDD.extraerManoJugador(IDPartida,IDUsuario,numJugadores,function(err,NunManos){
        if(err)
        {
            callback(err,null);
        }
        else
        {
            NunManos.forEach(function(num){
                mano.push(cartasJuego[num]);
            });
            callback(null,mano);
        }
    });
}
//Extrae las partidas que estan disponibles para el usuario
function partidasDisponibles(IDUsuario,callback)
{
    var i=0;
    var x=0;
    accBBDD.partidasUsuarioIguales(IDUsuario,function(err,asignadas){
        if(err)
        {
            callback(err,null);
        }
        else
        {
            accBBDD.partidasUsuarioNoIguales(IDUsuario,function(err,partidas){
                if(err)
                {
                    callback(err,null);
                }
                else
                {
                    if(asignadas[0]!==undefined && partidas[0]!==undefined && partidas.length> 0)
                    {
                        while (i<partidas.length && partidas[0]!==undefined && partidas.length> 0)
                        {
                            while (x<asignadas.length && asignadas.length>0 && partidas[0]!==undefined)
                            {
                                if(asignadas[x].ID_Partida== partidas[i].ID_Partida)
                                    partidas.splice(i,1);
                                x++;
                            }
                            x=0;
                            i++;
                        }
                        callback(null,partidas);                  
                    }
                    else if((asignadas[0]===undefined || asignadas.length<=0) && partidas[0]!==undefined && partidas.length> 0)
                    {
                        callback(null,partidas);
                    }
                    else if(partidas[0]===undefined || partidas.length<= 0)
                    {
                        callback(null,[]);
                    }
                    else
                    {
                        callback(new Error("Existen aignaciones a partidas inexistentes"),null);
                    }
                }
            });     
        }
    });
}
//Extrae las partidas en juego del usuario
function partidasEnJuego(IDUsuario,callback)
{
    var salida=[];
    accBBDD.partidasUsuarioIguales(IDUsuario,function(err,asignadas){
        if(err)
        {
            callback(err,null);
        }
        else
        {
            accBBDD.partidasUsuarioEnJuego(IDUsuario,function(err,partidas){
                if(err)
                {
                    callback(err,null);
                }
                else
                {
                    for (var i=0;i<partidas.length;i++)
                    {
                        for (var x=0;x<asignadas.length;x++)
                        {
                            if(asignadas[x].ID_Partida== partidas[i].ID_Partida)
                                salida.push(partidas[i]);
                        }
                    }
                    callback(null,salida);                  
                }
            });     
        }
    });
}

