-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               10.3.10-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             9.4.0.5125
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- Dumping database structure for platypus
CREATE DATABASE IF NOT EXISTS `platypus` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `platypus`;

-- Dumping structure for table platypus.belongs_to
CREATE TABLE IF NOT EXISTS `belongs_to` (
  `groupID` int(11) unsigned NOT NULL,
  `userID` int(11) unsigned NOT NULL,
  PRIMARY KEY (`groupID`,`userID`),
  KEY `FK_belongs_to_user` (`userID`),
  CONSTRAINT `FK_belongs_to_group` FOREIGN KEY (`groupID`) REFERENCES `groups` (`GroupID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_belongs_to_user` FOREIGN KEY (`userID`) REFERENCES `user` (`userID`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Data exporting was unselected.
-- Dumping structure for procedure platypus.delDoc
DELIMITER //
CREATE DEFINER=`root`@`localhost` PROCEDURE `delDoc`(
	IN `docIDparam` INT
)
BEGIN
	DECLARE `_rollback` BOOL DEFAULT 0;
	DECLARE CONTINUE HANDLER FOR SQLEXCEPTION SET `_rollback` = 1;
	START TRANSACTION;
		Delete from hasdocument Where docID = docIDparam;
		Delete from document Where docID = docIDparam;
		IF `_rollback`
			then ROLLBACK;
		else
			COMMIT;
		END IF;
END//
DELIMITER ;

-- Dumping structure for procedure platypus.delEvent
DELIMITER //
CREATE DEFINER=`root`@`localhost` PROCEDURE `delEvent`(
	IN `eventIDparam` INT
)
BEGIN
	DECLARE `_rollback` BOOL DEFAULT 0;
	DECLARE CONTINUE HANDLER FOR SQLEXCEPTION SET `_rollback` = 1;
	START TRANSACTION;
		Delete from hasevent Where eventID = eventIDparam;
		Delete from events Where eventID = eventIDparam;
		IF `_rollback`
			then ROLLBACK;
		else
			COMMIT;
		END IF;
END//
DELIMITER ;

-- Dumping structure for procedure platypus.delGroup
DELIMITER //
CREATE DEFINER=`root`@`localhost` PROCEDURE `delGroup`(
	IN `groupIDparam` INT



)
BEGIN
	DECLARE `_rollback` BOOL DEFAULT 0;
	DECLARE `counter` int DEFAULT 0;
	DECLARE `eventCount` int DEFAULT 0;
	DECLARE `docCount` int DEFAULT 0;
	DECLARE `taskCount` int DEFAULT 0;
	DECLARE CONTINUE HANDLER FOR SQLEXCEPTION SET `_rollback` = 1;
	START TRANSACTION;
	
			Set `counter` = (Select Count(groupID) from hasevent where groupID = groupIDparam);
			if `counter` > 0
			then
				While (Select Count(groupID) from hasevent where groupID = groupIDparam) > 0
				DO
		   		Set eventCount = (Select MIN(eventID) from hasevent where groupID = groupIDparam);
					Delete from hasevent Where eventID = eventCount;
					Delete from events Where eventID = eventCount;
				end while;
			end if;	
			
			Set `counter` = (Select Count(groupID) from hasdocument where groupID = groupIDparam);	
			if `counter` > 0
			then
				While (Select Count(groupID) from hasdocument where groupID = groupIDparam) > 0
				DO
		   		Set docCount = (Select MIN(docID) from hasdocument where groupID = groupIDparam);
					Delete from hasdocument Where docID = docCount;
					Delete from document Where docID = docCount;
				end while;
			end if;
	
			Set `counter` = (Select Count(groupID) from hastask where groupID = groupIDparam);
			if `counter` > 0
			then
				While (Select Count(groupID) from hastask where groupID = groupIDparam) > 0
				DO
			   	Set taskCount = (Select MIN(taskID) from hastask where groupID = groupIDparam);
					Delete from hastask Where taskID = taskCount;
					Delete from task Where taskID = taskCount;

				end while;
			end if;
			
					
			Delete from belongs_to Where groupID = groupIDparam;
			Delete from groups Where groupID = groupIDparam;

		IF `_rollback`
			then ROLLBACK;
		else
			COMMIT;
		END IF;
END//
DELIMITER ;

-- Dumping structure for procedure platypus.delTask
DELIMITER //
CREATE DEFINER=`root`@`localhost` PROCEDURE `delTask`(
	IN `taskIDparam` INT





)
BEGIN
	DECLARE `_rollback` BOOL DEFAULT 0;
	DECLARE CONTINUE HANDLER FOR SQLEXCEPTION SET `_rollback` = 1;
	START TRANSACTION;
		Delete from hastask Where taskID = taskIDparam;
		Delete from task Where taskID = taskIDparam;
		IF `_rollback`
			then ROLLBACK;
		else
			COMMIT;
		END IF;
END//
DELIMITER ;

-- Dumping structure for procedure platypus.delUser
DELIMITER //
CREATE DEFINER=`root`@`localhost` PROCEDURE `delUser`(
	IN `userIDparam` INT







)
BEGIN
	DECLARE `_rollback` BOOL DEFAULT 0;
	DECLARE `counter` int DEFAULT 0;
	DECLARE `eventCount` int DEFAULT 0;
	DECLARE `docCount` int DEFAULT 0;
	DECLARE `taskCount` int DEFAULT 0;
	DECLARE `groupIDcheck` int DEFAULT 0;
	DECLARE `deleteCount` int DEFAULT 0;
	DECLARE CONTINUE HANDLER FOR SQLEXCEPTION SET `_rollback` = 1;
	START TRANSACTION;
		
		Set `deleteCount` = 	(Select COUNT(groupID)
		From(
		SELECT groupID, userID
		FROM belongs_to
		Group by groupID
		HAVING COUNT(groupID) = 1 and userID = 1) as T);
		
		While `deleteCount` > 0
		DO
			Set `groupIDcheck` = (Select MIN(groupID)
			FROM (
			SELECT groupID, userID
			FROM belongs_to
			Group by groupID
			HAVING COUNT(groupID) = 1 and userID = 1) as M);	
		
			Set `counter` = (Select Count(groupID) from hasevent where groupID = groupIDcheck);
			if `counter` > 0
			then
				While (Select Count(groupID) from hasevent where groupID = groupIDcheck) > 0
				DO
		   		Set eventCount = (Select MIN(eventID) from hasevent where groupID = groupIDcheck);
					Delete from hasevent Where eventID = eventCount;
					Delete from events Where eventID = eventCount;
				end while;
			end if;	
			
			Set `counter` = (Select Count(groupID) from hasdocument where groupID = groupIDcheck);	
			if `counter` > 0
			then
				While (Select Count(groupID) from hasdocument where groupID = groupIDcheck) > 0
				DO
		   		Set docCount = (Select MIN(docID) from hasdocument where groupID = groupIDcheck);
					Delete from hasdocument Where docID = docCount;
					Delete from document Where docID = docCount;
				end while;
			end if;
	
			Set `counter` = (Select Count(groupID) from hastask where groupID = groupIDcheck);
			if `counter` > 0
			then
				While (Select Count(groupID) from hastask where groupID = groupIDcheck) > 0
				DO
			   	Set taskCount = (Select MIN(taskID) from hastask where groupID = groupIDcheck);
					Delete from hastask Where taskID = taskCount;
					Delete from task Where taskID = taskCount;
				end while;
			end if;
			
			Delete from belongs_to where groupID = groupIDcheck;
			Delete from groups Where groupID = groupIDcheck;

			Set `deleteCount` = `deleteCount` - 1;
			
		end while;
		
		Delete from belongs_to where userID = userIDparam;
		Delete from user where userID = userIDparam;
	
	IF `_rollback`
		then ROLLBACK;
	else
		COMMIT;
	END IF;
	
END//
DELIMITER ;

-- Dumping structure for table platypus.document
CREATE TABLE IF NOT EXISTS `document` (
  `docID` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `description` varchar(250) NOT NULL,
  `category` enum('Medical','Auto','Home','ToDo','Miscellaneous') NOT NULL,
  `filename` varchar(32) NOT NULL,
  `expiryDate` date DEFAULT NULL,
  PRIMARY KEY (`docID`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;

-- Data exporting was unselected.
-- Dumping structure for table platypus.events
CREATE TABLE IF NOT EXISTS `events` (
  `eventID` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `description` varchar(250) NOT NULL,
  `category` enum('Medical','Auto','Home','ToDo','Miscellaneous') NOT NULL,
  `startDate` date NOT NULL,
  `endDate` date NOT NULL,
  `location` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`eventID`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;

-- Data exporting was unselected.
-- Dumping structure for table platypus.groups
CREATE TABLE IF NOT EXISTS `groups` (
  `groupID` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `groupName` varchar(50) NOT NULL,
  PRIMARY KEY (`groupID`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;

-- Data exporting was unselected.
-- Dumping structure for table platypus.hasdocument
CREATE TABLE IF NOT EXISTS `hasdocument` (
  `groupID` int(11) unsigned NOT NULL,
  `docID` int(11) unsigned NOT NULL,
  `pinned` enum('0','1') NOT NULL DEFAULT '0',
  `notification` date DEFAULT NULL,
  PRIMARY KEY (`groupID`,`docID`),
  UNIQUE KEY `docID` (`docID`),
  CONSTRAINT `FK_hasdocument_document` FOREIGN KEY (`docID`) REFERENCES `document` (`docID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_hasdocument_groups` FOREIGN KEY (`groupID`) REFERENCES `groups` (`GroupID`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Data exporting was unselected.
-- Dumping structure for table platypus.hasevent
CREATE TABLE IF NOT EXISTS `hasevent` (
  `groupID` int(11) unsigned NOT NULL,
  `eventID` int(11) unsigned NOT NULL,
  `pinned` enum('0','1') NOT NULL DEFAULT '0',
  `notification` date DEFAULT NULL,
  PRIMARY KEY (`groupID`,`eventID`),
  UNIQUE KEY `eventID` (`eventID`),
  CONSTRAINT `FK_hasevent_events` FOREIGN KEY (`eventID`) REFERENCES `events` (`eventID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_hasevent_groups` FOREIGN KEY (`groupID`) REFERENCES `groups` (`GroupID`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Data exporting was unselected.
-- Dumping structure for table platypus.hastask
CREATE TABLE IF NOT EXISTS `hastask` (
  `groupID` int(11) unsigned NOT NULL,
  `taskID` int(11) unsigned NOT NULL,
  `pinned` enum('0','1') NOT NULL DEFAULT '0',
  `notification` date DEFAULT NULL,
  PRIMARY KEY (`groupID`,`taskID`),
  UNIQUE KEY `taskID` (`taskID`),
  CONSTRAINT `FK_hastask_groups` FOREIGN KEY (`groupID`) REFERENCES `groups` (`GroupID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_hastask_task` FOREIGN KEY (`taskID`) REFERENCES `task` (`taskID`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Data exporting was unselected.
-- Dumping structure for table platypus.task
CREATE TABLE IF NOT EXISTS `task` (
  `taskID` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `description` varchar(250) NOT NULL,
  `category` enum('Auto','Medical','Home','ToDo','Miscellaneous') NOT NULL,
  `deadline` date NOT NULL,
  `priority` int(1) unsigned NOT NULL,
  PRIMARY KEY (`taskID`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;

-- Data exporting was unselected.
-- Dumping structure for table platypus.user
CREATE TABLE IF NOT EXISTS `user` (
  `userID` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(32) NOT NULL,
  `firstName` varchar(32) NOT NULL,
  `lastName` varchar(32) NOT NULL,
  `email` varchar(32) NOT NULL,
  `userPassword` varchar(32) NOT NULL,
  `dateOfBirth` date NOT NULL,
  PRIMARY KEY (`userID`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

-- Data exporting was unselected.
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
