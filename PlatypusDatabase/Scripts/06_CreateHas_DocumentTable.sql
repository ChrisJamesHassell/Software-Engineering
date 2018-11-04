use platypus;
CREATE TABLE IF NOT EXISTS `has_document` (
  `groupID` int(11) unsigned NOT NULL,
  `docID` int(11) unsigned NOT NULL,
  `pinned` enum('0','1') NOT NULL DEFAULT '0',
  `notification` date DEFAULT NULL,
  PRIMARY KEY (`groupID`,`docID`),
  UNIQUE KEY `docID` (`docID`),
  CONSTRAINT `FK_hasdocument_document` FOREIGN KEY (`docID`) REFERENCES `document` (`docID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_hasdocument_groups` FOREIGN KEY (`groupID`) REFERENCES `groups` (`groupID`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
