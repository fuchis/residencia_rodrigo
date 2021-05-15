drop database residencia_dev;

CREATE DATABASE `residencia_dev` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci */;

use residencia_dev;

CREATE TABLE `bitacora` (
  `Id_Bitacora` int(11) NOT NULL AUTO_INCREMENT,
  `Id_Usuario` int(11) NOT NULL,
  `Usuario` varchar(255) COLLATE utf8mb4_spanish_ci DEFAULT NULL,
  `Nombre_Usuario` varchar(255) COLLATE utf8mb4_spanish_ci DEFAULT NULL,
  `Descripcion` text COLLATE utf8mb4_spanish_ci,
  `Fecha` datetime DEFAULT NULL,
  `Tipo` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`Id_Bitacora`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

CREATE TABLE `equipos` (
  `Id_Equipo` int(11) NOT NULL AUTO_INCREMENT,
  `Nombre` varchar(255) COLLATE utf8mb4_spanish_ci DEFAULT NULL,
  `Codigo_Serie` varchar(255) COLLATE utf8mb4_spanish_ci DEFAULT NULL,
  `Modelo` varchar(255) COLLATE utf8mb4_spanish_ci DEFAULT NULL,
  `Categoria` varchar(255) COLLATE utf8mb4_spanish_ci DEFAULT NULL,
  `Marca` varchar(255) COLLATE utf8mb4_spanish_ci DEFAULT NULL,
  `Descripcion` text COLLATE utf8mb4_spanish_ci,
  `Estado` int(11) NOT NULL,
  `Estado_Fisico_Equipo` int(11) DEFAULT '0',
  `Tiempo_Original` time DEFAULT NULL,
  `Tiempo_Restante` time DEFAULT NULL,
  `Tiempo_Restante_Porcentaje` decimal(5,2) DEFAULT NULL,
  PRIMARY KEY (`Id_Equipo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

CREATE TABLE `usuarios` (
  `Id_Usuario` int(11) NOT NULL AUTO_INCREMENT,
  `Nombre_Usuario` varchar(255) COLLATE utf8mb4_spanish_ci NOT NULL,
  `Nombre` text COLLATE utf8mb4_spanish_ci NOT NULL,
  `Apellido` text COLLATE utf8mb4_spanish_ci NOT NULL,
  `Tipo` int(11) NOT NULL,
  `Pass` varchar(255) COLLATE utf8mb4_spanish_ci NOT NULL,
  `Estado` int(11) NOT NULL,
  `Telefono` varchar(20) COLLATE utf8mb4_spanish_ci DEFAULT NULL,
  PRIMARY KEY (`Id_Usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

CREATE TABLE `horarios` (
  `Id_Horario` int(11) NOT NULL AUTO_INCREMENT,
  `Hora_Inicio` time DEFAULT NULL,
  `Hora_Fin` time DEFAULT NULL,
  PRIMARY KEY (`Id_Horario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

CREATE TABLE `horarios_equipos` (
  `Id_Horario_Equipos` int(11) NOT NULL AUTO_INCREMENT,
  `FK_Id_Horario` int(11) DEFAULT NULL,
  `FK_Id_Equipo` int(11) DEFAULT NULL,
  `Estado` text COLLATE utf8mb4_spanish_ci,
  PRIMARY KEY (`Id_Horario_Equipos`),
  KEY `FK_Id_Horario` (`FK_Id_Horario`),
  KEY `FK_Id_Equipo` (`FK_Id_Equipo`),
  CONSTRAINT `horarios_equipos_ibfk_1` FOREIGN KEY (`FK_Id_Horario`) REFERENCES `horarios` (`Id_Horario`) ON UPDATE CASCADE,
  CONSTRAINT `horarios_equipos_ibfk_2` FOREIGN KEY (`FK_Id_Equipo`) REFERENCES `equipos` (`Id_Equipo`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

CREATE TABLE `prestamos` (
  `Id_prestamo` int(11) NOT NULL AUTO_INCREMENT,
  `Id_Usuario` int(11) DEFAULT NULL,
  `Id_Equipo` int(11) DEFAULT NULL,
  `fk_horarios` int(11) DEFAULT NULL,
  `Fecha` datetime DEFAULT NULL,
  `Estado` varchar(255) COLLATE utf8mb4_spanish_ci DEFAULT NULL,
  PRIMARY KEY (`Id_prestamo`),
  KEY `Id_Usuario` (`Id_Usuario`),
  KEY `Id_Equipo` (`Id_Equipo`),
  KEY `fk_horarios` (`fk_horarios`),
  CONSTRAINT `prestamos_ibfk_1` FOREIGN KEY (`Id_Usuario`) REFERENCES `usuarios` (`Id_Usuario`) ON UPDATE CASCADE,
  CONSTRAINT `prestamos_ibfk_2` FOREIGN KEY (`Id_Equipo`) REFERENCES `equipos` (`Id_Equipo`) ON UPDATE CASCADE,
  CONSTRAINT `prestamos_ibfk_3` FOREIGN KEY (`fk_horarios`) REFERENCES `horarios_equipos` (`Id_Horario_Equipos`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

CREATE TABLE `reservaciones` (
  `Id_Reservacion` int(11) NOT NULL AUTO_INCREMENT,
  `FK_Id_Usuario` int(11) DEFAULT NULL,
  `FK_Id_horarios_equipos` int(11) DEFAULT NULL,
  `FK_Id_Equipos` int(11) DEFAULT NULL,
  PRIMARY KEY (`Id_Reservacion`),
  KEY `FK_Id_Usuario` (`FK_Id_Usuario`),
  KEY `FK_Id_horarios_equipos` (`FK_Id_horarios_equipos`),
  KEY `FK_Id_Equipos` (`FK_Id_Equipos`),
  CONSTRAINT `reservaciones_ibfk_1` FOREIGN KEY (`FK_Id_Usuario`) REFERENCES `usuarios` (`Id_Usuario`) ON UPDATE CASCADE,
  CONSTRAINT `reservaciones_ibfk_2` FOREIGN KEY (`FK_Id_horarios_equipos`) REFERENCES `horarios_equipos` (`Id_Horario_Equipos`) ON UPDATE CASCADE,
  CONSTRAINT `reservaciones_ibfk_3` FOREIGN KEY (`FK_Id_Equipos`) REFERENCES `equipos` (`Id_Equipo`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

CREATE TABLE IF NOT EXISTS `Parametros`(
	`Id_Parametros` int(11) NOT NULL AUTO_INCREMENT,
	`Email` varchar(255) COLLATE utf8mb4_spanish_ci DEFAULT NULL,
    `Password` varchar(255) COLLATE utf8mb4_spanish_ci DEFAULT NULL,
    `Notificar` varchar(255) COLLATE utf8mb4_spanish_ci DEFAULT NULL,
    `Telefono` varchar(255) COLLATE utf8mb4_spanish_ci DEFAULT NULL,
	PRIMARY KEY (`Id_Parametros`)		
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

CREATE TABLE IF NOT EXISTS `Parametros`(
	`Id_Parametros` int(11) NOT NULL AUTO_INCREMENT,
	`Email` varchar(255) COLLATE utf8mb4_spanish_ci DEFAULT NULL,
    `Password` varchar(255) COLLATE utf8mb4_spanish_ci DEFAULT NULL,
    `Telefono` varchar(255) COLLATE utf8mb4_spanish_ci DEFAULT NULL,
	PRIMARY KEY (`Id_Parametros`)		
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

DROP PROCEDURE IF EXISTS `residencia_dev`.`CrearRelacionEquipoReservacion`;
DELIMITER $$
CREATE PROCEDURE `CrearRelacionEquipoReservacion`(EquipoId INT)
BEGIN
	DECLARE NumeroHorarios INT DEFAULT 0;
    DECLARE IteradorHorarios INT DEFAULT 1;
    SET NumeroHorarios = (SELECT COUNT(*) from `residencia_dev`.`horarios`);
    SELECT NumeroHorarios;
    WHILE IteradorHorarios <= NumeroHorarios DO
		INSERT INTO `residencia_dev`.`horarios_equipos`(FK_Id_Horario, FK_Id_Equipo, Estado) VALUES(IteradorHorarios, EquipoId, "D");
        SET IteradorHorarios = IteradorHorarios + 1;
    END WHILE;
END$$
DELIMITER ;

DROP PROCEDURE IF EXISTS `residencia_dev`.`CrearReservacionUsuarioEquipo`;
DELIMITER $$
CREATE PROCEDURE `CrearReservacionUsuarioEquipo` (UsuarioId INT, EquipoId INT, HorarioId Int)
BEGIN
	INSERT INTO `residencia_dev`.`reservaciones`(Fk_Id_Usuario, Fk_id_horarios_equipos, Fk_Id_Equipos) VALUES (UsuarioId, HorarioId, EquipoId);
    UPDATE `residencia_dev`.`reservaciones` SET Estado = "R" ;
END$$
DELIMITER ;

DROP PROCEDURE IF EXISTS `residencia_dev`.`Tiempo`;
DELIMITER $$
CREATE PROCEDURE `Tiempo` (EquipoId INT, TiempoResta TIME)
BEGIN
	-- DECLARACION DE VARIABLES
    DECLARE TIEMPO TIME;
    DECLARE TIEMPO_RESTA TIME;
    DECLARE TIEMPO_OG TIME;
    DECLARE TIEMPO_RESTA_INT INT;
    DECLARE TIEMPO_OG_INT INT;
    DECLARE TIEMPO_RESTANTE_INT INT;
    DECLARE TIEMPO_PORC DECIMAL(5,2);
	DECLARE TIEMPO_PORC_FINAL DECIMAL(5,2);
    -- INICIALIZACION DE VARIABLES
    SET TIEMPO_OG = (SELECT Tiempo_Original From `residencia_dev`.`equipos` where Id_Equipo=EquipoId);
    SET TIEMPO = (SELECT Tiempo_Restante From `residencia_dev`.`equipos` where Id_Equipo=EquipoId);
    SET TIEMPO_RESTA = subtime((SELECT TIEMPO), TiempoResta);
	SET TIEMPO_OG_INT = (SELECT CONVERT((SELECT SUBSTRING_INDEX(CAST(TIEMPO_OG AS char), ':', 1)), SIGNED));
    SET TIEMPO_RESTA_INT = (SELECT CONVERT((SELECT SUBSTRING_INDEX(CAST(TiempoResta AS char), ':', 1)), SIGNED));
    SET TIEMPO_RESTANTE_INT = (SELECT CONVERT((SELECT SUBSTRING_INDEX(CAST(TIEMPO AS char), ':', 1)), SIGNED));
    -- SACAR PORCENTAJE
	SET TIEMPO_PORC = (SELECT TIEMPO_RESTA_INT * 100)/TIEMPO_OG_INT;   
    -- ACTUALIZAR TIEMPOS
    IF CAST(TIEMPO_RESTA AS TIME) <= CAST('00:00:00' AS TIME) THEN
		UPDATE equipos SET Tiempo_Restante  = '00:00:00', Tiempo_Restante_Porcentaje=0.00, Estado=0 WHERE Id_Equipo=EquipoId;
        SET TIEMPO_PORC_FINAL = (SELECT TIEMPO_Restante_Porcentaje FROM equipos WHERE Id_Equipo=EquipoId);
        IF TIEMPO_PORC_FINAL < 25.00 and TIEMPO_PORC_FINAL >= 0.00 THEN
			UPDATE equipos SET Estado_Fisico_Equipo = 3 where Id_Equipo=EquipoId;
        END IF;
	ELSE
		UPDATE equipos SET Tiempo_Restante  = TIEMPO_RESTA, TIEMPO_Restante_Porcentaje=TIEMPO_Restante_Porcentaje-TIEMPO_PORC where Id_Equipo=EquipoId;
        SET TIEMPO_PORC_FINAL = (SELECT TIEMPO_Restante_Porcentaje FROM equipos WHERE Id_Equipo=EquipoId);
        IF TIEMPO_PORC_FINAL < 25.00 and TIEMPO_PORC_FINAL >= 0.00 THEN
			UPDATE equipos SET Estado_Fisico_Equipo = 3 where Id_Equipo=EquipoId;
        END IF;
        IF TIEMPO_PORC_FINAL < 75.00 THEN
			UPDATE equipos SET Estado_Fisico_Equipo = 1 where Id_Equipo=EquipoId;
        END IF;
        IF TIEMPO_PORC_FINAL < 50.00 THEN
			UPDATE equipos SET Estado_Fisico_Equipo = 2 where Id_Equipo=EquipoId;
        END IF;
        
    END IF;
END$$
DELIMITER ;

INSERT INTO `residencia_dev`.`horarios`(`Hora_Inicio`,`Hora_Fin`) VALUES('07:00:00','08:00:00');
INSERT INTO `residencia_dev`.`horarios`(`Hora_Inicio`,`Hora_Fin`) VALUES('08:00:00','09:00:00');
INSERT INTO `residencia_dev`.`horarios`(`Hora_Inicio`,`Hora_Fin`) VALUES('09:00:00','10:00:00');
INSERT INTO `residencia_dev`.`horarios`(`Hora_Inicio`,`Hora_Fin`) VALUES('10:00:00','11:00:00');
INSERT INTO `residencia_dev`.`horarios`(`Hora_Inicio`,`Hora_Fin`) VALUES('11:00:00','12:00:00');
INSERT INTO `residencia_dev`.`horarios`(`Hora_Inicio`,`Hora_Fin`) VALUES('12:00:00','13:00:00');
INSERT INTO `residencia_dev`.`horarios`(`Hora_Inicio`,`Hora_Fin`) VALUES('13:00:00','14:00:00');
INSERT INTO `residencia_dev`.`horarios`(`Hora_Inicio`,`Hora_Fin`) VALUES('14:00:00','15:00:00');
INSERT INTO `residencia_dev`.`horarios`(`Hora_Inicio`,`Hora_Fin`) VALUES('15:00:00','16:00:00');
INSERT INTO `residencia_dev`.`horarios`(`Hora_Inicio`,`Hora_Fin`) VALUES('16:00:00','17:00:00');
INSERT INTO `residencia_dev`.`horarios`(`Hora_Inicio`,`Hora_Fin`) VALUES('17:00:00','18:00:00');
INSERT INTO `residencia_dev`.`horarios`(`Hora_Inicio`,`Hora_Fin`) VALUES('18:00:00','19:00:00');
INSERT INTO `residencia_dev`.`horarios`(`Hora_Inicio`,`Hora_Fin`) VALUES('19:00:00','20:00:00');
INSERT INTO `residencia_dev`.`horarios`(`Hora_Inicio`,`Hora_Fin`) VALUES('20:00:00','21:00:00');

INSERT INTO `residencia_dev`.`usuarios` (`Nombre_Usuario`,`Nombre`,`Apellido`,`Tipo`,`Pass`,`Estado`,`Telefono`) VALUES ('admin','Administrador','Sistema',1,'$2b$10$JKysiRbBMqPaINjhQhxfiOg9AiLrvCoAi1diPYSWDMQJglBQijA0.',1,'9999999999');
INSERT INTO `residencia_dev`.`usuarios` (`Nombre_Usuario`,`Nombre`,`Apellido`,`Tipo`,`Pass`,`Estado`,`Telefono`) VALUES ('rodrigo','Rodrigo','Chable',2,'$2b$10$JKysiRbBMqPaINjhQhxfiOg9AiLrvCoAi1diPYSWDMQJglBQijA0.',1,'9999999999');
INSERT INTO `residencia_dev`.`usuarios` (`Nombre_Usuario`,`Nombre`,`Apellido`,`Tipo`,`Pass`,`Estado`,`Telefono`) VALUES ('maestro','maestro_prueba','prueba',3,'$2b$10$JKysiRbBMqPaINjhQhxfiOg9AiLrvCoAi1diPYSWDMQJglBQijA0.',1,'9999999999');

INSERT INTO `residencia_dev`.`equipos`(`Nombre`,`Codigo_Serie`,`Modelo`,`Categoria`,`Marca`,`Descripcion`,`Estado`,`Estado_Fisico_Equipo`,`Tiempo_Original`, `Tiempo_Restante`, `Tiempo_Restante_Porcentaje`) VALUES ('ARTICULO 1','CODIGO ARTICULO 1','MODELO 1','CATEGORIA 1','MARCA 1','DESCRIPCION 1',1,0,'10:00:00', '10:00:00', 100.00);
INSERT INTO `residencia_dev`.`equipos`(`Nombre`,`Codigo_Serie`,`Modelo`,`Categoria`,`Marca`,`Descripcion`,`Estado`,`Estado_Fisico_Equipo`,`Tiempo_Original`, `Tiempo_Restante`, `Tiempo_Restante_Porcentaje`) VALUES ('ARTICULO 2','CODIGO ARTICULO 2','MODELO 2','CATEGORIA 2','MARCA 2','DESCRIPCION 2',1,0,'10:00:00', '10:00:00', 100.00);
INSERT INTO `residencia_dev`.`equipos`(`Nombre`,`Codigo_Serie`,`Modelo`,`Categoria`,`Marca`,`Descripcion`,`Estado`,`Estado_Fisico_Equipo`,`Tiempo_Original`, `Tiempo_Restante`, `Tiempo_Restante_Porcentaje`) VALUES ('ARTICULO 3','CODIGO ARTICULO 3','MODELO 3','CATEGORIA 3','MARCA 3','DESCRIPCION 3',1,0,'10:00:00', '10:00:00', 100.00);
INSERT INTO `residencia_dev`.`equipos`(`Nombre`,`Codigo_Serie`,`Modelo`,`Categoria`,`Marca`,`Descripcion`,`Estado`,`Estado_Fisico_Equipo`,`Tiempo_Original`, `Tiempo_Restante`, `Tiempo_Restante_Porcentaje`) VALUES ('ARTICULO 4','CODIGO ARTICULO 4','MODELO 4','CATEGORIA 4','MARCA 4','DESCRIPCION 4',1,0,'10:00:00', '10:00:00', 100.00);

CALL `residencia_dev`.`CrearRelacionEquipoReservacion`(1);
CALL `residencia_dev`.`CrearRelacionEquipoReservacion`(2);
CALL `residencia_dev`.`CrearRelacionEquipoReservacion`(3);
CALL `residencia_dev`.`CrearRelacionEquipoReservacion`(4);