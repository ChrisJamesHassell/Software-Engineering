use platypus;
DELIMITER //
CREATE DEFINER=`platypus`@`localhost` PROCEDURE `delGroup`(
	IN `groupIDparam` INT
)
BEGIN
	DECLARE `_rollback` BOOL DEFAULT 0;
	DECLARE `counter` int DEFAULT 0;
	DECLARE `eventCount` int DEFAULT 0;
	DECLARE `docCount` int DEFAULT 0;
	DECLARE `taskCount` int DEFAULT 0;
	DECLARE CONTINUE HANDLER FOR SQLEXCEPTION SET `_rollback` = 1;
	START TRANSACTION;
	
			Set `counter` = (Select Count(groupID) from has_event where groupID = groupIDparam);
			if `counter` > 0
			then
				While (Select Count(groupID) from has_event where groupID = groupIDparam) > 0
				DO
		   		Set eventCount = (Select MIN(eventID) from has_event where groupID = groupIDparam);
					Delete from has_event Where eventID = eventCount;
					Delete from userevents Where eventID = eventCount;
				end while;
			end if;	
			
			Set `counter` = (Select Count(groupID) from has_document where groupID = groupIDparam);	
			if `counter` > 0
			then
				While (Select Count(groupID) from has_document where groupID = groupIDparam) > 0
				DO
		   		Set docCount = (Select MIN(docID) from has_document where groupID = groupIDparam);
					Delete from has_document Where docID = docCount;
					Delete from document Where docID = docCount;
				end while;
			end if;
	
			Set `counter` = (Select Count(groupID) from has_task where groupID = groupIDparam);
			if `counter` > 0
			then
				While (Select Count(groupID) from has_task where groupID = groupIDparam) > 0
				DO
			   	Set taskCount = (Select MIN(taskID) from has_task where groupID = groupIDparam);
					Delete from has_task Where taskID = taskCount;
					Delete from task Where taskID = taskCount;

				end while;
			end if;
			
					
			Delete from belongs_to Where groupID = groupIDparam;
			Delete from groups Where groupID = groupIDparam;

		IF `_rollback`
			then ROLLBACK;
		else
			COMMIT;
		END IF;
END//
DELIMITER ;