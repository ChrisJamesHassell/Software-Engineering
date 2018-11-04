use platypus;
CREATE TABLE IF NOT EXISTS `belongs_to` (
  `groupID` int(11) unsigned NOT NULL,
  `userID` int(11) unsigned NOT NULL,
  `self` enum('0','1') DEFAULT NULL,
  `owner` int(11) unsigned DEFAULT NULL,
  PRIMARY KEY (`groupID`,`userID`),
  KEY `FK_belongs_to_user` (`userID`),
  CONSTRAINT `FK_belongs_to_group` FOREIGN KEY (`groupID`) REFERENCES `groups` (`groupID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_belongs_to_user` FOREIGN KEY (`userID`) REFERENCES `users` (`userID`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Data exporting was unselected.
-- Dumping structure for procedure platypus.delDoc
