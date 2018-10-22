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
  `itemID` int(11) unsigned NOT NULL,
  `GroupID` int(11) unsigned NOT NULL,
  `pinned` binary(1) NOT NULL DEFAULT '0',
  `notify` date NOT NULL,
  PRIMARY KEY (`itemID`),
  KEY `FK_has_group` (`GroupID`),
  KEY `itemID` (`itemID`),
  CONSTRAINT `FK_has_group` FOREIGN KEY (`GroupID`) REFERENCES `group` (`GroupID`),
  CONSTRAINT `FK_has_item` FOREIGN KEY (`itemID`) REFERENCES `item` (`itemID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Data exporting was unselected.
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
