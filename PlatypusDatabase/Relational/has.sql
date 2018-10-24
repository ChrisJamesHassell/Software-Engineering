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

-- Dumping structure for table project_database.has
CREATE TABLE IF NOT EXISTS `has` (
  `GroupID` int(11) unsigned NOT NULL,
  `itemID` int(11) unsigned NOT NULL,
  `type` enum('task','event','doc') NOT NULL,
  `pinned` binary(1) NOT NULL DEFAULT '0',
  `notify` date NOT NULL,
  PRIMARY KEY (`GroupID`),
  KEY `itemID_type_GroupID` (`itemID`,`type`,`GroupID`),
  KEY `FK_has_task_2` (`type`),
  CONSTRAINT `FK_has_document` FOREIGN KEY (`itemID`) REFERENCES `document` (`documentID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_has_document_2` FOREIGN KEY (`type`) REFERENCES `document` (`docType`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_has_event` FOREIGN KEY (`itemID`) REFERENCES `event` (`eventID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_has_event_2` FOREIGN KEY (`type`) REFERENCES `event` (`eventType`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_has_group` FOREIGN KEY (`GroupID`) REFERENCES `group` (`GroupID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_has_task` FOREIGN KEY (`itemID`) REFERENCES `task` (`taskID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_has_task_2` FOREIGN KEY (`type`) REFERENCES `task` (`taskType`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Data exporting was unselected.
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
