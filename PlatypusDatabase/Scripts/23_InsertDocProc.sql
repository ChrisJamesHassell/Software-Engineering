use platypus;
DELIMITER //
CREATE DEFINER=`platypus`@`localhost` PROCEDURE `insertDoc`(
	IN `pinned` enum('0', '1'),
	IN `notification` DATE,
	IN `groupID` int(11),
	IN `name` VARCHAR(32),
	IN `description` VARCHAR(250),
	IN `category` enum('Auto','Medical','Home','ToDo','Miscellaneous'),
	IN `fileName` VARCHAR(32),
	IN `expirationDate` DATE
)
BEGIN
    DECLARE `_rollback` BOOL DEFAULT 0;
    DECLARE CONTINUE HANDLER FOR SQLEXCEPTION SET `_rollback` = 1;
    
    START TRANSACTION;
    
    SET pinned = IF(pinned = null, 0, pinned); -- If pinned is null set to 0, otherwise set to itself
    
    INSERT INTO document (name, description, category, fileName, expirationDate)
	 VALUES (name, description, category, fileName, expirationDate);
    
    SET @docID = last_insert_id(); -- get last inserted task's ID
    
    INSERT INTO has_document VALUES (
     groupID,
     @docID,
     pinned,
     notification);
        
    IF `_rollback` THEN
        ROLLBACK;
    ELSE
        COMMIT;
    END IF;
END//
DELIMITER ;