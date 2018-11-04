use platypus;
DELIMITER //
DROP PROCEDURE IF EXISTS delDoc;
CREATE DEFINER=`platypus`@`localhost` PROCEDURE `delDoc`(
	IN `docIDparam` INT

)
BEGIN
	DECLARE `_rollback` BOOL DEFAULT 0;
	DECLARE CONTINUE HANDLER FOR SQLEXCEPTION SET `_rollback` = 1;
	START TRANSACTION;
		Delete from has_document Where docID = docIDparam;
		Delete from document Where docID = docIDparam;
		IF `_rollback`
			then ROLLBACK;
		else
			COMMIT;
		END IF;
END//
DELIMITER ;