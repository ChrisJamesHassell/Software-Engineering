use platypus;
CREATE TABLE IF NOT EXISTS `has_task` (
  `groupID` int(11) unsigned NOT NULL,
  `taskID` int(11) unsigned NOT NULL,
  `pinned` enum('0','1') NOT NULL DEFAULT '0',
  `notification` date DEFAULT NULL,
  PRIMARY KEY (`groupID`,`taskID`),
  UNIQUE KEY `taskID` (`taskID`),
  CONSTRAINT `FK_hastask_groups` FOREIGN KEY (`groupID`) REFERENCES `groups` (`groupID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_hastask_task` FOREIGN KEY (`taskID`) REFERENCES `task` (`taskID`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;