DROP SCHEMA IF EXISTS okamotolab;
CREATE SCHEMA okamotolab;
USE okamotolab;
SET AUTOCOMMIT=0;

DROP TABLE IF EXISTS `members`;
CREATE TABLE `okamotolab`.`members` (
  `ID` INT(7) NOT NULL,
  `Name` VARCHAR(20) NOT NULL,
  `Password` VARCHAR(20) NOT NULL,
  PRIMARY KEY (`ID`)
);