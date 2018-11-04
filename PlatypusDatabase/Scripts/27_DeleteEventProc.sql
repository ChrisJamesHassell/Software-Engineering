use platypus;
DELIMITER //
CREATE DEFINER=`platypus`@`localhost` PROCEDURE `delEvent`(
	IN `eventIDparam` INT


)
BEGIN
	DECLARE `_rollback` BOOL DEFAULT 0;
	DECLARE CONTINUE HANDLER FOR SQLEXCEPTION SET `_rollback` = 1;
	START TRANSACTION;
		Delete from has_event Where eventID = eventIDparam;
		Delete from userevents Where eventID = eventIDparam;
		IF `_rollback`
			then ROLLBACK;
		else
			COMMIT;
		END IF;
END//
DELIMITER ;