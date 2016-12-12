/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/**
 * Author:  Olayer
 * Created: 04-dic-2016
 */
-- MySQL Workbench Synchronization
-- Generated: 2016-12-11 21:36
-- Model: New Model
-- Version: 1.0
-- Project: Name of the project
-- Author: Olayer

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema saboteur
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema saboteur
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `saboteur` DEFAULT CHARACTER SET utf8 ;
USE `saboteur` ;

-- -----------------------------------------------------
-- Table `saboteur`.`Usuarios`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `saboteur`.`Usuarios` (
  `ID_usuario` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID del usuario para su busqueda rapida',
  `Nick` VARCHAR(20) NOT NULL,
  `Nombre` VARCHAR(45) NOT NULL,
  `Apellidos` VARCHAR(45) NOT NULL,
  `Contraseña` VARCHAR(8) NOT NULL,
  `Fecha_Nac` VARCHAR(10) NOT NULL,
  `Sexo` VARCHAR(1) NOT NULL,
  `Imagen` LONGBLOB NULL,
  PRIMARY KEY (`ID_usuario`),
  UNIQUE INDEX `ID_UNIQUE` (`ID_usuario` ASC),
  UNIQUE INDEX `Nick_UNIQUE` (`Nick` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `saboteur`.`Partidas`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `saboteur`.`Partidas` (
  `ID_Partida` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `Nombre` VARCHAR(20) NOT NULL,
  `Estado_Partida` INT UNSIGNED NOT NULL DEFAULT 0,
  `Creador` INT UNSIGNED NOT NULL,
  `Num_Jugadores` INT UNSIGNED NOT NULL DEFAULT 0,
  `Num_Max_Jugadores` INT UNSIGNED NOT NULL,
  `Turno` INT UNSIGNED NOT NULL DEFAULT 0,
  `Ganador` VARCHAR(30) NULL,
  `Num_Turnos` INT UNSIGNED NOT NULL,
  `Fecha_Creacion` VARCHAR(10) NOT NULL,
  `Partidascol` VARCHAR(45) NULL,
  `Turno_juego` INT(2) UNSIGNED NULL DEFAULT '1',
  PRIMARY KEY (`ID_Partida`),
  UNIQUE INDEX `ID_UNIQUE` (`ID_Partida` ASC),
  UNIQUE INDEX `Nombre_UNIQUE` (`Nombre` ASC),
  CONSTRAINT `ID_Creador`
    FOREIGN KEY (`Creador`)
    REFERENCES `saboteur`.`Usuarios` (`ID_usuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `saboteur`.`Asignacion_Partidas`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `saboteur`.`Asignacion_Partidas` (
  `ID_Partida` INT UNSIGNED NOT NULL,
  `ID_Usuario` INT UNSIGNED NOT NULL,
  `Tipo_Jugador` VARCHAR(1) NULL,
  `Pos_Turno` INT(2) UNSIGNED NULL,
  `mano1` VARCHAR(20) NULL,
  `mano2` VARCHAR(20) NULL,
  `mano3` VARCHAR(20) NULL,
  `mano4` VARCHAR(20) NULL,
  `mano5` VARCHAR(20) NULL,
  `mano6` VARCHAR(20) NULL,
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
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `saboteur`.`Tableros`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `saboteur`.`Tableros` (
  `ID_Tablero` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `ID_Partida` INT UNSIGNED NOT NULL,
  `A1` VARCHAR(20) NULL,
  `A2` VARCHAR(20) NULL,
  `A3` VARCHAR(20) NULL,
  `A4` VARCHAR(20) NULL,
  `A5` VARCHAR(20) NULL,
  `A6` VARCHAR(20) NULL,
  `A7` VARCHAR(20) NULL,
  `B1` VARCHAR(20) NULL,
  `B2` VARCHAR(20) NULL,
  `B3` VARCHAR(20) NULL,
  `B4` VARCHAR(20) NULL,
  `B5` VARCHAR(20) NULL,
  `B6` VARCHAR(20) NULL,
  `B7` VARCHAR(20) NULL,
  `C1` VARCHAR(20) NULL,
  `C2` VARCHAR(20) NULL,
  `C3` VARCHAR(20) NULL,
  `C4` VARCHAR(20) NULL,
  `C5` VARCHAR(20) NULL,
  `C6` VARCHAR(20) NULL,
  `C7` VARCHAR(20) NULL,
  `D1` VARCHAR(20) NULL,
  `D2` VARCHAR(20) NULL,
  `D3` VARCHAR(20) NULL,
  `D4` VARCHAR(20) NULL,
  `D5` VARCHAR(20) NULL,
  `D6` VARCHAR(20) NULL,
  `D7` VARCHAR(20) NULL,
  `E1` VARCHAR(20) NULL,
  `E2` VARCHAR(20) NULL,
  `E3` VARCHAR(20) NULL,
  `E4` VARCHAR(20) NULL,
  `E5` VARCHAR(20) NULL,
  `E6` VARCHAR(20) NULL,
  `E7` VARCHAR(20) NULL,
  `F1` VARCHAR(20) NULL,
  `F2` VARCHAR(20) NULL,
  `F3` VARCHAR(20) NULL,
  `F4` VARCHAR(20) NULL,
  `F5` VARCHAR(20) NULL,
  `F6` VARCHAR(20) NULL,
  `F7` VARCHAR(20) NULL,
  `G1` VARCHAR(20) NULL,
  `G2` VARCHAR(20) NULL,
  `G3` VARCHAR(20) NULL,
  `G4` VARCHAR(20) NULL,
  `G5` VARCHAR(20) NULL,
  `G6` VARCHAR(20) NULL,
  `G7` VARCHAR(20) NULL,
  PRIMARY KEY (`ID_Tablero`),
  CONSTRAINT `ID_Partida1`
    FOREIGN KEY (`ID_Partida`)
    REFERENCES `saboteur`.`Partidas` (`ID_Partida`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
