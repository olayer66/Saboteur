/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/**
 * Author:  Olayer
 * Created: 04-dic-2016
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
  `Num_Max_Jugadores` INT(10) UNSIGNED NOT NULL DEFAULT 2,
  `Turno` INT(10) UNSIGNED NOT NULL,
  `Ganador` INT(10) UNSIGNED NULL DEFAULT NULL,
  `Num_Turnos` INT(10) UNSIGNED NOT NULL,
  `Fecha_Creacion` VARCHAR(10) NOT NULL,
  PRIMARY KEY (`ID_Partida`),
  UNIQUE INDEX `ID_UNIQUE` (`ID_Partida` ASC),
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
  `Tipo_Jugador` VARCHAR(1) NOT NULL,
  `mano1` VARCHAR(2) NOT NULL,
  `mano2` VARCHAR(2) NOT NULL,
  `mano3` VARCHAR(2) NOT NULL,
  `mano4` VARCHAR(2) NOT NULL,
  `mano5` VARCHAR(2) NOT NULL,
  `mano6` VARCHAR(2) NOT NULL,
  PRIMARY KEY (`ID_Partida`, `ID_Usuario`),
  INDEX `ID` (`ID_Partida` ASC),
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

CREATE TABLE IF NOT EXISTS `saboteur`.`Tableros` (
  `ID_Tablero` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `ID_Partida` INT(10) UNSIGNED NOT NULL,
  `A1` VARCHAR(2) NULL DEFAULT NULL,
  `A2` VARCHAR(2) NULL DEFAULT NULL,
  `A3` VARCHAR(2) NULL DEFAULT NULL,
  `A4` VARCHAR(2) NULL DEFAULT NULL,
  `A5` VARCHAR(2) NULL DEFAULT NULL,
  `A6` VARCHAR(2) NULL DEFAULT NULL,
  `A7` VARCHAR(2) NULL DEFAULT NULL,
  `B1` VARCHAR(2) NULL DEFAULT NULL,
  `B2` VARCHAR(2) NULL DEFAULT NULL,
  `B3` VARCHAR(2) NULL DEFAULT NULL,
  `B4` VARCHAR(2) NULL DEFAULT NULL,
  `B5` VARCHAR(2) NULL DEFAULT NULL,
  `B6` VARCHAR(2) NULL DEFAULT NULL,
  `B7` VARCHAR(2) NULL DEFAULT NULL,
  `C1` VARCHAR(2) NULL DEFAULT NULL,
  `C2` VARCHAR(2) NULL DEFAULT NULL,
  `C3` VARCHAR(2) NULL DEFAULT NULL,
  `C4` VARCHAR(2) NULL DEFAULT NULL,
  `C5` VARCHAR(2) NULL DEFAULT NULL,
  `C6` VARCHAR(2) NULL DEFAULT NULL,
  `C7` VARCHAR(2) NULL DEFAULT NULL,
  `D1` VARCHAR(2) NULL DEFAULT NULL,
  `D2` VARCHAR(2) NULL DEFAULT NULL,
  `D3` VARCHAR(2) NULL DEFAULT NULL,
  `D4` VARCHAR(2) NULL DEFAULT NULL,
  `D5` VARCHAR(2) NULL DEFAULT NULL,
  `D6` VARCHAR(2) NULL DEFAULT NULL,
  `D7` VARCHAR(2) NULL DEFAULT NULL,
  `E1` VARCHAR(2) NULL DEFAULT NULL,
  `E2` VARCHAR(2) NULL DEFAULT NULL,
  `E3` VARCHAR(2) NULL DEFAULT NULL,
  `E4` VARCHAR(2) NULL DEFAULT NULL,
  `E5` VARCHAR(2) NULL DEFAULT NULL,
  `E6` VARCHAR(2) NULL DEFAULT NULL,
  `E7` VARCHAR(2) NULL DEFAULT NULL,
  `F1` VARCHAR(2) NULL DEFAULT NULL,
  `F2` VARCHAR(2) NULL DEFAULT NULL,
  `F3` VARCHAR(2) NULL DEFAULT NULL,
  `F4` VARCHAR(2) NULL DEFAULT NULL,
  `F5` VARCHAR(2) NULL DEFAULT NULL,
  `F6` VARCHAR(2) NULL DEFAULT NULL,
  `F7` VARCHAR(2) NULL DEFAULT NULL,
  `G1` VARCHAR(2) NULL DEFAULT NULL,
  `G2` VARCHAR(2) NULL DEFAULT NULL,
  `G3` VARCHAR(2) NULL DEFAULT NULL,
  `G4` VARCHAR(2) NULL DEFAULT NULL,
  `G5` VARCHAR(2) NULL DEFAULT NULL,
  `G6` VARCHAR(2) NULL DEFAULT NULL,
  `G7` VARCHAR(2) NULL DEFAULT NULL,
  PRIMARY KEY (`ID_Tablero`),
  CONSTRAINT `ID_Partida1`
    FOREIGN KEY (`ID_Partida`)
    REFERENCES `saboteur`.`Partidas` (`ID_Partida`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;