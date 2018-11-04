use platypus;
DELIMITER //
CREATE DEFINER=`platypus`@`localhost` PROCEDURE `delUser`(
	IN `userIDparam` INT
)
BEGIN
	DECLARE `_rollback` BOOL DEFAULT 0;
	DECLARE `counter` int DEFAULT 0;
	DECLARE `eventCount` int DEFAULT 0;
	DECLARE `docCount` int DEFAULT 0;
	DECLARE `taskCount` int DEFAULT 0;
	DECLARE `groupIDcheck` int DEFAULT 0;
	DECLARE `deleteCount` int DEFAULT 0;
	DECLARE CONTINUE HANDLER FOR SQLEXCEPTION SET `_rollback` = 1;
	START TRANSACTION;
		
		Set `deleteCount` = 	(Select COUNT(groupID)
		From(
		SELECT groupID, userID
		FROM belongs_to
		Group by groupID
		HAVING COUNT(groupID) = 1 and userID = userIDparam) as T);
		
		While `deleteCount` > 0
		DO
			Set `groupIDcheck` = (Select MIN(groupID)
			FROM (
			SELECT groupID, userID
			FROM belongs_to
			Group by groupID
			HAVING COUNT(groupID) = 1 and userID = userIDparam) as M);	
		
			Set `counter` = (Select Count(groupID) from has_event where groupID = groupIDcheck);
			if `counter` > 0
			then
				While (Select Count(groupID) from has_event where groupID = groupIDcheck) > 0
				DO
		   		Set eventCount = (Select MIN(eventID) from has_event where groupID = groupIDcheck);
					Delete from has_event Where eventID = eventCount;
					Delete from userevents Where eventID = eventCount;
				end while;
			end if;	
			
			Set `counter` = (Select Count(groupID) from has_document where groupID = groupIDcheck);	
			if `counter` > 0
			then
				While (Select Count(groupID) from has_document where groupID = groupIDcheck) > 0
				DO
		   		Set docCount = (Select MIN(docID) from has_document where groupID = groupIDcheck);
					Delete from has_document Where docID = docCount;
					Delete from document Where docID = docCount;
				end while;
			end if;
	
			Set `counter` = (Select Count(groupID) from has_task where groupID = groupIDcheck);
			if `counter` > 0
			then
				While (Select Count(groupID) from has_task where groupID = groupIDcheck) > 0
				DO
			   	Set taskCount = (Select MIN(taskID) from has_task where groupID = groupIDcheck);
					Delete from has_task Where taskID = taskCount;
					Delete from task Where taskID = taskCount;
				end while;
			end if;
			
			Delete from belongs_to where groupID = groupIDcheck;
			Delete from groups Where groupID = groupIDcheck;


			Set `deleteCount` = `deleteCount` - 1;
			
		end while;
		
		Delete from belongs_to where userID = userIDparam;
		Delete from users where userID = userIDparam;
	
	IF `_rollback`
		then ROLLBACK;
	else
		COMMIT;
	END IF;
	
END//
DELIMITER ;