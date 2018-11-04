use platypus;
CREATE TABLE IF NOT EXISTS `task` (
  `taskID` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `description` varchar(250) NOT NULL,
  `category` enum('Auto','Medical','Home','ToDo','Miscellaneous') NOT NULL,
  `deadline` date NOT NULL,
  `priority` enum('Low','Mid','High') NOT NULL,
  `completed` enum('0','1') NOT NULL DEFAULT '0',
  PRIMARY KEY (`taskID`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;