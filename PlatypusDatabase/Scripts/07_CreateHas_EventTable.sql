use platypus;
CREATE TABLE IF NOT EXISTS `has_event` (
  `groupID` int(11) unsigned NOT NULL,
  `eventID` int(11) unsigned NOT NULL,
  `pinned` enum('0','1') NOT NULL DEFAULT '0',
  `notification` date DEFAULT NULL,
  PRIMARY KEY (`groupID`,`eventID`),
  UNIQUE KEY `eventID` (`eventID`),
  CONSTRAINT `FK_hasevent_events` FOREIGN KEY (`eventID`) REFERENCES `userevents` (`eventID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_hasevent_groups` FOREIGN KEY (`groupID`) REFERENCES `groups` (`groupID`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;