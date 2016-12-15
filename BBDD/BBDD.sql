/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/**
 * Author:  Olayer
 * Created: 13-dic-2016
 */

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

CREATE SCHEMA IF NOT EXISTS `saboteur` DEFAULT CHARACTER SET utf8 ;

CREATE TABLE IF NOT EXISTS `saboteur`.`Usuarios` (
  `ID_usuario` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID del usuario para su busqueda rapida',
  `Nick` VARCHAR(20) NOT NULL,
  `Nombre` VARCHAR(45) NOT NULL,
  `Apellidos` VARCHAR(45) NOT NULL,
  `Contraseña` VARCHAR(8) NOT NULL,
  `Fecha_Nac` VARCHAR(10) NOT NULL,
  `Sexo` VARCHAR(1) NOT NULL,
  `Imagen` LONGBLOB NULL DEFAULT NULL,
  PRIMARY KEY (`ID_usuario`),
  UNIQUE INDEX `ID_UNIQUE` (`ID_usuario` ASC),
  UNIQUE INDEX `Nick_UNIQUE` (`Nick` ASC))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

CREATE TABLE IF NOT EXISTS `saboteur`.`Partidas` (
  `ID_Partida` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `Nombre` VARCHAR(20) NOT NULL,
  `Estado_Partida` INT(10) UNSIGNED NOT NULL DEFAULT 0,
  `Creador` INT(10) UNSIGNED NOT NULL,
  `Num_Jugadores` INT(10) UNSIGNED NOT NULL DEFAULT 0,
  `Num_Max_Jugadores` INT(10) UNSIGNED NOT NULL,
  `Turno` INT(10) UNSIGNED NOT NULL DEFAULT 0,
  `Ganador` VARCHAR(30) NULL DEFAULT NULL,
  `Num_Turnos` INT(10) UNSIGNED NOT NULL,
  `Fecha_Creacion` VARCHAR(10) NOT NULL,
  `Turno_juego` INT(2) UNSIGNED NULL DEFAULT '1',
  PRIMARY KEY (`ID_Partida`),
  UNIQUE INDEX `ID_UNIQUE` (`ID_Partida` ASC),
  UNIQUE INDEX `Nombre_UNIQUE` (`Nombre` ASC),
  CONSTRAINT `ID_Creador`
    FOREIGN KEY (`Creador`)
    REFERENCES `saboteur`.`Usuarios` (`ID_usuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

CREATE TABLE IF NOT EXISTS `saboteur`.`Asignacion_Partidas` (
  `ID_Partida` INT(10) UNSIGNED NOT NULL,
  `ID_Usuario` INT(10) UNSIGNED NOT NULL,
  `Tipo_Jugador` VARCHAR(1) NULL DEFAULT NULL,
  `Pos_Turno` INT(2) UNSIGNED NULL DEFAULT NULL,
  `mano1` INT(2) NULL DEFAULT NULL,
  `mano2` INT(2) NULL DEFAULT NULL,
  `mano3` INT(2) NULL DEFAULT NULL,
  `mano4` INT(2) NULL DEFAULT NULL,
  `mano5` INT(2) NULL DEFAULT NULL,
  `mano6` INT(2) NULL DEFAULT NULL,
  PRIMARY KEY (`ID_Partida`, `ID_Usuario`),
  INDEX `ID` (`ID_Usuario` ASC),
  CONSTRAINT `ID_partida`
    FOREIGN KEY (`ID_Partida`)
    REFERENCES `saboteur`.`Partidas` (`ID_Partida`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `ID_usuario`
    FOREIGN KEY (`ID_Usuario`)
    REFERENCES `saboteur`.`Usuarios` (`ID_usuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

CREATE TABLE IF NOT EXISTS `saboteur`.`Piezas_partida` (
  `ID_Partida` INT(10) UNSIGNED NOT NULL,
  `Pos_Pieza` INT(2) UNSIGNED NOT NULL,
  `Tipo_Pieza` INT(2) UNSIGNED NOT NULL,
  `Propietario` VARCHAR(20) NOT NULL,
  PRIMARY KEY (`ID_Partida`),
  INDEX `INDEX` (`ID_Partida` ASC),
  CONSTRAINT `ID_Piezas_Partida`
    FOREIGN KEY (`ID_Partida`)
    REFERENCES `saboteur`.`Partidas` (`ID_Partida`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

INSERT INTO Usuarios(Nick,Nombre,Apellidos,Contraseña,Fecha_Nac,Sexo,Imagen) VALUES ('turre2', 'a', 'b', '1234', '16/12/1992', 'H', ?);


INSERT INTO Usuarios(Nick,Nombre,Apellidos,Contraseña,Fecha_Nac,Sexo,Imagen) VALUES ('olayer','Jose','Sanchez','1234','21/01/2016','M',NULL);
INSERT INTO Usuarios(Nick,Nombre,Apellidos,Contraseña,Fecha_Nac,Sexo,Imagen) VALUES ('paco','Paco','Fernandez','1234','22/01/2016','M',NULL);