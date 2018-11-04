use platypus;
DELIMITER //
CREATE DEFINER=`platypus`@`localhost` PROCEDURE `delTask`(
	IN `taskIDparam` INT
)
BEGIN
	DECLARE `_rollback` BOOL DEFAULT 0;
	DECLARE CONTINUE HANDLER FOR SQLEXCEPTION SET `_rollback` = 1;
	START TRANSACTION;
		Delete from has_task Where taskID = taskIDparam;
		Delete from task Where taskID = taskIDparam;
		IF `_rollback`
			then ROLLBACK;
		else
			COMMIT;
		END IF;
END//
DELIMITER ;