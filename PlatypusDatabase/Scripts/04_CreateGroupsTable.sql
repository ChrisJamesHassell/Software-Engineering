use platypus;
CREATE TABLE IF NOT EXISTS `groups` (
  `groupID` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `groupName` varchar(50) NOT NULL DEFAULT '"Me"',
  PRIMARY KEY (`groupID`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=latin1;