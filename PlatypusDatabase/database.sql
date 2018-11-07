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
  `groupID` INT(11) unsigned NOT NULL,
  `userID` INT(11) unsigned NOT NULL,
  `self` binary(1) DEFAULT NULL,
  `owner` INT(11) unsigned DEFAULT NULL,
  PRIMARY KEY (`groupID`,`userID`),
  KEY `FK_belongs_to_users` (`userID`),
  CONSTRAINT `FK_belongs_to_group` FOREIGN KEY (`groupID`) REFERENCES `groups` (`groupID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_belongs_to_users` FOREIGN KEY (`userID`) REFERENCES `users` (`userID`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Data exporting was unselected.
-- Dumping structure for procedure platypus.delDoc
DELIMITER //
CREATE DEFINER=`platypus`@`localhost` PROCEDURE `delDoc`(
	IN `docIDparam` INT
)
BEGIN
	DECLARE `_rollback` BOOL DEFAULT 0;
	DECLARE CONTINUE HANDLER FOR SQLEXCEPTION SET `_rollback` = 1;
	START TRANSACTION;
	-- DELETE documents relation(s), then DELETE the document
		DELETE FROM has_documents WHERE docID = docIDparam;
		DELETE FROM documents WHERE docID = docIDparam;
		IF `_rollback`
			THEN ROLLBACK;
		else
			COMMIT;
		END IF;
END//
DELIMITER ;

-- Dumping structure for procedure platypus.delEvent
DELIMITER //
CREATE DEFINER=`platypus`@`localhost` PROCEDURE `delEvent`(
	IN `eventIDparam` INT
)
BEGIN
	DECLARE `_rollback` BOOL DEFAULT 0;
	DECLARE CONTINUE HANDLER FOR SQLEXCEPTION SET `_rollback` = 1;
	START TRANSACTION;
	-- DELETE Event relation(s), then DELETE the Event
		DELETE FROM has_events WHERE eventID = eventIDparam;
		DELETE FROM userevents WHERE eventID = eventIDparam;
		IF `_rollback`
			THEN ROLLBACK;
		else
			COMMIT;
		END IF;
END//
DELIMITER ;

-- Dumping structure for procedure platypus.delGroup
DELIMITER //
CREATE DEFINER=`platypus`@`localhost` PROCEDURE `delGroup`(
	IN `groupIDparam` INT
)
BEGIN
	DECLARE `_rollback` BOOL DEFAULT 0;		-- error flag
	DECLARE `counter` INT DEFAULT 0;		-- counter for looping over results
	DECLARE `eventCount` INT DEFAULT 0;
	DECLARE `docCount` INT DEFAULT 0;
	DECLARE `taskCount` INT DEFAULT 0;
	DECLARE CONTINUE HANDLER FOR SQLEXCEPTION SET `_rollback` = 1;
	START TRANSACTION;
	
	-- Count number of relations with the deleting group's ID
	SET `counter` = (SELECT COUNT(groupID) FROM has_events WHERE groupID = groupIDparam);
	IF `counter` > 0
	THEN
		WHILE (SELECT COUNT(groupID) FROM has_events WHERE groupID = groupIDparam) > 0
		DO
			-- assign min eventID associated with deleting group's ID
			SET eventCount = (SELECT MIN(eventID) FROM has_events WHERE groupID = groupIDparam);
			DELETE FROM has_events WHERE eventID = eventCount;
			DELETE FROM userevents WHERE eventID = eventCount;
		END WHILE;
	END IF;	
	
	SET `counter` = (SELECT COUNT(groupID) FROM has_documents WHERE groupID = groupIDparam);	
	IF `counter` > 0
	THEN
		WHILE (SELECT COUNT(groupID) FROM has_documents WHERE groupID = groupIDparam) > 0
		DO
		SET docCount = (SELECT MIN(docID) FROM has_documents WHERE groupID = groupIDparam);
			DELETE FROM has_documents WHERE docID = docCount;
			DELETE FROM documents WHERE docID = docCount;
		END WHILE;
	END IF;

	SET `counter` = (SELECT COUNT(groupID) FROM has_tasks WHERE groupID = groupIDparam);
	IF `counter` > 0
	THEN
		WHILE (SELECT COUNT(groupID) FROM has_tasks WHERE groupID = groupIDparam) > 0
		DO
		SET taskCount = (SELECT MIN(taskID) FROM has_tasks WHERE groupID = groupIDparam);
			DELETE FROM has_tasks WHERE taskID = taskCount;
			DELETE FROM tasks WHERE taskID = taskCount;

		END WHILE;
	END IF;
	
	DELETE FROM belongs_to WHERE groupID = groupIDparam;
	DELETE FROM groups WHERE groupID = groupIDparam;

	IF `_rollback`
		THEN ROLLBACK;
	else
		COMMIT;
	END IF;
END//
DELIMITER ;

-- Dumping structure for procedure platypus.delTask
DELIMITER //
CREATE DEFINER=`platypus`@`localhost` PROCEDURE `delTask`(
	IN `taskIDparam` INT
)
BEGIN
	DECLARE `_rollback` BOOL DEFAULT 0;
	DECLARE CONTINUE HANDLER FOR SQLEXCEPTION SET `_rollback` = 1;
	START TRANSACTION;
		DELETE FROM has_tasks WHERE taskID = taskIDparam;
		DELETE FROM tasks WHERE taskID = taskIDparam;
		IF `_rollback`
			THEN ROLLBACK;
		else
			COMMIT;
		END IF;
END//
DELIMITER ;

-- Dumping structure for procedure platypus.delUser
DELIMITER //
CREATE DEFINER=`platypus`@`localhost` PROCEDURE `delUser`( IN `userIDparam` INT )
BEGIN
	DECLARE `_rollback` BOOL DEFAULT 0;
	DECLARE `counter` INT DEFAULT 0;
	DECLARE `eventCount` INT DEFAULT 0;
	DECLARE `docCount` INT DEFAULT 0;
	DECLARE `taskCount` INT DEFAULT 0;
	DECLARE `groupIDcheck` INT DEFAULT 0;
	DECLARE `deleteCount` INT DEFAULT 0;
	DECLARE CONTINUE HANDLER FOR SQLEXCEPTION SET `_rollback` = 1;
	START TRANSACTION;
		
		SET `deleteCount` = (SELECT COUNT(groupID)
			FROM(
				SELECT groupID, userID
				FROM belongs_to
				GROUP BY groupID
				HAVING COUNT(groupID) = 1 AND userID = userIDparam) as T);
		
		WHILE `deleteCount` > 0
		DO
			SET `groupIDcheck` = (SELECT MIN(groupID)
			FROM (
				SELECT groupID, userID
				FROM belongs_to
				GROUP BY groupID
				HAVING COUNT(groupID) = 1 AND userID = userIDparam) as M);
		
			SET `counter` = (SELECT COUNT(groupID) FROM has_events WHERE groupID = groupIDcheck);
			IF `counter` > 0
			THEN
				WHILE (SELECT COUNT(groupID) FROM has_events WHERE groupID = groupIDcheck) > 0
				DO
				SET eventCount = (SELECT MIN(eventID) FROM has_events WHERE groupID = groupIDcheck);
					DELETE FROM has_events WHERE eventID = eventCount;
					DELETE FROM userevents WHERE eventID = eventCount;
				END WHILE;
			END IF;	
			
			SET `counter` = (SELECT COUNT(groupID) FROM has_documents WHERE groupID = groupIDcheck);
			IF `counter` > 0
			THEN
				WHILE (SELECT COUNT(groupID) FROM has_documents WHERE groupID = groupIDcheck) > 0
				DO
				SET docCount = (SELECT MIN(docID) FROM has_documents WHERE groupID = groupIDcheck);
					DELETE FROM has_documents WHERE docID = docCount;
					DELETE FROM documents WHERE docID = docCount;
				END WHILE;
			END IF;
	
			SET `counter` = (SELECT COUNT(groupID) FROM has_tasks WHERE groupID = groupIDcheck);
			IF `counter` > 0
			THEN
				WHILE (SELECT COUNT(groupID) FROM has_tasks WHERE groupID = groupIDcheck) > 0
				DO
				SET taskCount = (SELECT MIN(taskID) FROM has_tasks WHERE groupID = groupIDcheck);
					DELETE FROM has_tasks WHERE taskID = taskCount;
					DELETE FROM tasks WHERE taskID = taskCount;
				END WHILE;
			END IF;
			
			DELETE FROM belongs_to WHERE groupID = groupIDcheck;
			DELETE FROM groups WHERE groupID = groupIDcheck;


			SET `deleteCount` = `deleteCount` - 1;
			
		END WHILE;
		
		DELETE FROM belongs_to WHERE userID = userIDparam;
		DELETE FROM users WHERE userID = userIDparam;
	
	IF `_rollback`
		THEN ROLLBACK;
	else
		COMMIT;
	END IF;
	
END//
DELIMITER ;

-- Dumping structure for table platypus.documents
CREATE TABLE IF NOT EXISTS `documents` (
  `docID` INT(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `description` varchar(250) NOT NULL,
  `category` enum('Appliances','Auto','Meals','Medical','Miscellaneous') NOT NULL,
  `fileName` varchar(128) NOT NULL,
  `expirationDate` date DEFAULT NULL,
  PRIMARY KEY (`docID`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;

-- Data exporting was unselected.
-- Dumping structure for table platypus.groups
CREATE TABLE IF NOT EXISTS `groups` (
  `groupID` INT(11) unsigned NOT NULL AUTO_INCREMENT,
  `groupName` varchar(50) NOT NULL DEFAULT '"Me"',
  PRIMARY KEY (`groupID`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=latin1;

-- Data exporting was unselected.
-- Dumping structure for table platypus.has_documents
CREATE TABLE IF NOT EXISTS `has_documents` (
  `groupID` INT(11) unsigned NOT NULL,
  `docID` INT(11) unsigned NOT NULL,
  `pinned` binary(1) NOT NULL DEFAULT '0',
  `notification` date DEFAULT NULL,
  PRIMARY KEY (`groupID`,`docID`),
  UNIQUE KEY `docID` (`docID`),
  CONSTRAINT `FK_hasdocuments_documents` FOREIGN KEY (`docID`) REFERENCES `documents` (`docID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_hasdocuments_groups` FOREIGN KEY (`groupID`) REFERENCES `groups` (`groupID`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Data exporting was unselected.
-- Dumping structure for table platypus.has_events
CREATE TABLE IF NOT EXISTS `has_events` (
  `groupID` INT(11) unsigned NOT NULL,
  `eventID` INT(11) unsigned NOT NULL,
  `pinned` binary(1) NOT NULL DEFAULT '0',
  `notification` date DEFAULT NULL,
  PRIMARY KEY (`groupID`,`eventID`),
  UNIQUE KEY `eventID` (`eventID`),
  CONSTRAINT `FK_hasevents_events` FOREIGN KEY (`eventID`) REFERENCES `userevents` (`eventID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_hasevents_groups` FOREIGN KEY (`groupID`) REFERENCES `groups` (`groupID`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Data exporting was unselected.
-- Dumping structure for table platypus.has_tasks
CREATE TABLE IF NOT EXISTS `has_tasks` (
  `groupID` INT(11) unsigned NOT NULL,
  `taskID` INT(11) unsigned NOT NULL,
  `pinned` binary(1) NOT NULL DEFAULT '0',
  `notification` date DEFAULT NULL,
  PRIMARY KEY (`groupID`,`taskID`),
  UNIQUE KEY `taskID` (`taskID`),
  CONSTRAINT `FK_hastasks_groups` FOREIGN KEY (`groupID`) REFERENCES `groups` (`groupID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_hastasks_tasks` FOREIGN KEY (`taskID`) REFERENCES `tasks` (`taskID`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Data exporting was unselected.
-- Dumping structure for procedure platypus.insertDoc
DELIMITER //
CREATE DEFINER=`platypus`@`localhost` PROCEDURE `insertDoc`(
	IN `pinned` enum('0', '1'),
	IN `notification` DATE,
	IN `groupID` INT(11),
	IN `name` VARCHAR(32),
	IN `description` VARCHAR(250),
        IN `category` enum('Appliances', 'Auto', 'Meals', 'Medical'),
	IN `fileName` VARCHAR(32),
	IN `expirationDate` DATE
)
BEGIN
    DECLARE `_rollback` BOOL DEFAULT 0;
    DECLARE CONTINUE HANDLER FOR SQLEXCEPTION SET `_rollback` = 1;

    START TRANSACTION;

    SET pinned = IF(pinned = null, 0, pinned); -- If pinned is null set to 0, otherwise set to itself

    INSERT INTO documents (name, description, category, fileName, expirationDate)
	 VALUES (name, description, category, fileName, expirationDate);

    SET @docID = last_insert_id(); -- get last inserted task's ID
    
    INSERT INTO has_documents VALUES (
     groupID,
     @docID,
     pinned,
     notification);
        
    IF `_rollback` THEN
        ROLLBACK;
    ELSE
        COMMIT;
    END IF;
END//
DELIMITER ;

-- Dumping structure for procedure platypus.insertEvent
DELIMITER //
CREATE DEFINER=`platypus`@`localhost` PROCEDURE `insertEvent`(
	IN `pinned` enum('0', '1'),
	IN `notification` DATE,
	IN `groupID` INT(11),
	IN `name` VARCHAR(32),
	IN `description` VARCHAR(250),
        IN `category` enum('Appliances', 'Auto', 'Meals', 'Medical'),
	IN `startDate` DATE,
	IN `endDate` DATE,
	IN `location` VARCHAR(100)
)
BEGIN
    DECLARE `_rollback` BOOL DEFAULT 0;
    DECLARE CONTINUE HANDLER FOR SQLEXCEPTION SET `_rollback` = 1;
    
    START TRANSACTION;
    
    SET pinned = IF(pinned = null, 0, pinned); -- If pinned is null set to 0, otherwise set to itself
    
    INSERT INTO userevents(name, description, category, startDate, endDate, location)
	 VALUES (name, description, category, startDate, endDate, location);
    
    SET @eventID = last_insert_id(); -- get last inserted task's ID
    
    INSERT INTO has_events VALUES (
     groupID,
     @eventID,
     pinned,
     notification);
        
    IF `_rollback` THEN
        ROLLBACK;
    ELSE
        COMMIT;
    END IF;
END//
DELIMITER ;

-- Dumping structure for procedure platypus.insertTask
DELIMITER //
CREATE DEFINER=`platypus`@`localhost` PROCEDURE `insertTask`(
	IN `pinned` enum('0', '1'),
	IN `notification` DATE,
	IN `groupID` INT(11),
	IN `name` VARCHAR(32),
	IN `description` VARCHAR(250),
        IN `category` enum('Appliances', 'Auto', 'Meals', 'Medical'),
	IN `deadline` DATE,
        IN `priority` enum('Low','Mid','High')
)
BEGIN
    DECLARE `_rollback` BOOL DEFAULT 0;
    DECLARE CONTINUE HANDLER FOR SQLEXCEPTION SET `_rollback` = 1;

    START TRANSACTION;

    SET pinned = IF(pinned = null, 0, pinned); -- If pinned is null set to 0, otherwise set to itself
    
    INSERT INTO tasks (name, description, category, deadline, priority)
	 VALUES (name, description, category, deadline, priority);
    
    SET @taskID = last_insert_id(); -- get last inserted task's ID
    
    INSERT INTO has_tasks VALUES (
     groupID,
     @taskID,
     pinned,
     notification);
        
    IF `_rollback` THEN
        ROLLBACK;
    ELSE
        COMMIT;
    END IF;
END//
DELIMITER ;

-- Dumping structure for procedure platypus.insertUser
DELIMITER //
CREATE DEFINER=`platypus`@`localhost` PROCEDURE `insertUser`(
	IN `username` VARCHAR(32),
	IN `firstName` VARCHAR(32),
	IN `lastName` VARCHAR(32),
	IN `email` VARCHAR(32),
	IN `userPassword` VARCHAR(64),
	IN `dateOfBirth` DATE
)
BEGIN
    DECLARE `_rollback` BOOL DEFAULT 0;
    DECLARE CONTINUE HANDLER 
	 FOR SQLEXCEPTION 
	 BEGIN	 
		 SET `_rollback` = 1;
		 RESIGNAL;
	 END;		 
    START TRANSACTION;
    INSERT INTO users (username, firstName, lastName, email, userPassword, dateOfBirth) 
	 VALUES (
    username, 
    firstName, 
    lastName, 
    email, 
    userPassword, 
    dateOfBirth
	 );
    
    SET @user_id = last_insert_id(); -- retrieve userID
    
    INSERT INTO groups (groupName) VALUES ("Me");
    
    SET @group_id = last_insert_id(); -- retrieve groupID
    
    INSERT INTO belongs_to VALUES (
	 @group_id,
	 @user_id,
	 "1",
	 @user_id
	 );
    
    IF `_rollback` THEN
        ROLLBACK;
     ELSE
        COMMIT;
    END IF;
END//
DELIMITER ;

-- Dumping structure for table platypus.tasks
CREATE TABLE IF NOT EXISTS `tasks` (
  `taskID` INT(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `description` varchar(250) NOT NULL,
  `category` enum('Appliances','Auto','Meals','Medical','Miscellaneous') NOT NULL,
  `deadline` date NOT NULL,
  `priority` enum('Low','Mid','High') NOT NULL,
  `completed` binary(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`taskID`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;

-- Data exporting was unselected.
-- Dumping structure for table platypus.userevents
CREATE TABLE IF NOT EXISTS `userevents` (
  `eventID` INT(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `description` varchar(250) NOT NULL,
  `category` enum('Appliances','Auto','Meals','Medical','Miscellaneous') NOT NULL,
  `startDate` date NOT NULL,
  `endDate` date NOT NULL,
  `location` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`eventID`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1;

-- Data exporting was unselected.
-- Dumping structure for table platypus.users
CREATE TABLE IF NOT EXISTS `users` (
  `userID` INT(11) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(32) NOT NULL,
  `firstName` varchar(32) NOT NULL,
  `lastName` varchar(32) NOT NULL,
  `email` varchar(32) NOT NULL,
  `userPassword` varchar(64) NOT NULL COMMENT 'Changed to 64 length',
  `dateOfBirth` date NOT NULL,
  PRIMARY KEY (`userID`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=latin1;

-- Data exporting was unselected.
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
