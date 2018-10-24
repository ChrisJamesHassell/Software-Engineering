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


-- Dumping database structure for project_database
CREATE DATABASE IF NOT EXISTS `project_database` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `project_database`;

-- Dumping structure for table project_database.user
CREATE TABLE IF NOT EXISTS `user` (
  `user_id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT 'Database generated userID',
  `first_name` varchar(32) NOT NULL COMMENT 'User''s first name',
  `last_name` varchar(32) NOT NULL COMMENT 'User''s last name',
  `username` varchar(32) NOT NULL COMMENT 'User''s username',
  `password` varchar(32) NOT NULL COMMENT 'User''s password (will be changed for encryption)',
  `email` varchar(32) NOT NULL COMMENT 'User''s email address',
  `date_of_birth` date NOT NULL COMMENT 'User''s date of birth',
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=124 DEFAULT CHARSET=latin1;

-- Data exporting was unselected.
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
