/* 
 * Funciones dedicadas al crontrol de una jugada de partida
 * Valores entrada
 * CartaMano --> Carta de la mano seleccionada por el usuario (mano1,mano2,...,mano6)
 * posicionTablero --> Posicion en el tablero que se quiere insertar la carta (entre 0 y 48)
 * Errores
    * 0 --> Si el error es critico(BBDD,fallos funcion,Etc)
    * 1 --> Si son fallos relacionados con la funcionalidad(no encaja,ya existe una pieza en la posicion,etc)
 * Retorno de la validacion de la jugada
    * true --> La juagada es valida (se procede a formalizarla)
    * false --> La jugada no es valida (se retorna el motivo por error con tipo de error 1)  
 */
"use strict";
var accBBDD =require("./accesoBBDD");
var cartasJuego= require("./cartasjuego");
module.exports={
    validarJugada: validarJugada
};
function  validarJugada(IDUsuario,IDPartida,cartaMano,posicionTablero,callback)
{
    //validar entrada
    if((cartaMano!==null || undefined) && cartaMano>=0 && cartaMano<=14)
    {
        if((posicionTablero!==null || undefined) && posicionTablero>=0 && posicionTablero<=48)
        {
            //Comprobar que la callida del tablero esta vacia
            posicionTableroValida(IDPartida,posicionTablero,function(err,tipoError){
                if(err)
                {
                    callback(err,tipoError);
                }
                else
                {
                    //Extraemos las posiciones de las casillas del entorno del la selecionada para insertar
                    calcularPosicionEnTablero(IDPartida,posicionTablero,function(err,cartasTablero){
                        if(err)
                        {
                            callback(err,0);
                        }
                        else
                        {
                            //Extraemos las cartas asociadas a la mano y a las casillas del entorno
                            extraerCartas(cartaMano,cartasTablero,function(err,mano,tablero){
                                if(err)
                                {
                                    callback(err,1);
                                }
                                else
                                {
                                    //Validamos la colocacion de la carta con respecto a los bordes
                                    validacion(mano,tablero,function (err,estado){
                                        if(err)
                                        {
                                            callback(err,1);
                                        }
                                        else
                                        {
                                            callback(null,estado);
                                        }
                                    });
                                }
                            });
                        }
                    });
                }           
            });
        }
        else
        {
            callback(new Error("La casilla del tablero seleccionada no es valida"),1);
        }
    }
    else
    {
        callback(new Error("La carta de la mano seleccionada no es valida"),1);
    }
}
/*======================================FUNCIONES AUXILIARES=======================================================*/
//Comprueba si la casilla de isnercion esta vacia
function posicionTableroValida(IDPartida,posicion,callback)
{
    accBBDD.extraerUnaPieza(IDPartida,posicion,function(err,pieza){
        if(err)
        {
            callback(err,0);
        }
        else
        {
            if(pieza[0].ID_Pieza===undefined)
            {
                callback(null);
            }
            else
            {
                callback(new Error("La posicion seleccionada ya esta ocupaa por otra pieza"),1);
            }
        }
    });
}
//calcula las cartas que se han de sacar entorno a la posicion de la insercion
function calcularPosicionEnTablero(IDPartida,posicionTablero,callback){
    posiciones=[posicionTablero-7,posicionTablero-1,posicionTablero+1,posicionTablero+7];
    accBBDD.extraerPiezasEntorno (IDPartida,posiciones,function (err,tiposPieza){
        if(err)
        {
            callback(err,null);
        }
        else
        {
            callback(null,tiposPieza);
        }
    });
}
//Extrae la cartas cartas del array que se han de jugar
function extraerCartas(cartaMano,cartasTablero,callback)
{
    var tablero=[];
    var contNull=0;
    cartasTablero.forEach(function (tipo)
    {
        if(tipo===undefined)
        {
            tablero.push(null);
            contNull++;
        }
        else
        {
            tablero.push(cartasJuego[tipo]);
        }
    });
    if(contNull===4)
    {
        callback(new Error("No existe ninguna carta adyacente a la posicion seleccionada"),null);
    }
    else
    {
        callback(null,cartasJuego[cartaMano],tablero);
    }
}
function validacion(mano,tablero,callback)
{
    var key=2;
    var cont=0;
    var valido=false;
    //Recorremos las propiedades la mano desde la 2 (up)
    for (key in mano) 
    {
        if (mano.hasOwnProperty(key)) 
        {
           // Si hay pieza en ese lado
           if(tablero[cont]!==null)
           {
                //Si pieza del tablero es superior
                if(cont===0)
                {
                    //Si mano UP es distindo de pieza del tablero DOWN
                    if(mano[key]!==tablero[cont].down)
                    {
                        valido=false;
                    }
                    else
                    {
                        valido=true;
                    }
                }
                //Si pieza del tablero es inferior
                else if(cont===1)
                {
                    //Si mano DOWN es distindo de pieza del tablero UP
                    if(mano[key]!==tablero[cont].up)
                    {
                        valido=false;
                    }
                    else
                    {
                        valido=true;
                    }
                }
                //Si pieza del tablero es la izquierda
                else if(cont===2)
                {
                    //Si mano LEFT es distindo de pieza del tablero RIGTH
                    if(mano[key]!==tablero[cont].rigth)
                    {
                        valido=false;
                    }
                    else
                    {
                        valido=true;
                    }
                }
                //Si pieza del tablero es la derecha
                else
                {
                    //Si mano RIGTH es distindo de pieza del tablero LEFT
                    if(mano[key]!==tablero[cont].left)
                    {
                        valido=false;
                    }
                    else
                    {
                        valido=true;
                    }
                }
           }
        }
        cont++;
    }
    if(valido===false)
        callback(new Error("La colocacion no es valida"),null);
    else
        callback(null,true);
}

