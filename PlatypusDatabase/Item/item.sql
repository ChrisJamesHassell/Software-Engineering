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

-- Dumping structure for table project_database.item
CREATE TABLE IF NOT EXISTS `item` (
  `itemID` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'Primary key for item table, unique, self-incrementing identifier for user created items',
  `type` enum('Task','Event','Document') NOT NULL COMMENT 'Enumerated type that allows for the differentiation of the type of item by task, event, or document',
  `name` varchar(32) NOT NULL COMMENT 'Name of the user created item',
  `description` varchar(250) NOT NULL COMMENT 'Short description of the user created item',
  `category` enum('Medical','Auto','Home','ToDo') NOT NULL COMMENT 'Enumerated type that allows for differentiation of categories of user created items by medical, auto, home, or todo.',
  PRIMARY KEY (`itemID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Data exporting was unselected.
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
