use platypus;
CREATE TABLE IF NOT EXISTS `document` (
  `docID` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `description` varchar(250) NOT NULL,
  `category` enum('Medical','Auto','Home','ToDo','Miscellaneous') NOT NULL,
  `fileName` varchar(128) NOT NULL,
  `expirationDate` date DEFAULT NULL,
  PRIMARY KEY (`docID`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;