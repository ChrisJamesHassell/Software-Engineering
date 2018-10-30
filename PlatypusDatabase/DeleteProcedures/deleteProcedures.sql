-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               10.3.10-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             9.4.0.5125
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

-- Dumping structure for procedure platypus.delDoc
DELIMITER //
CREATE DEFINER=`root`@`localhost` PROCEDURE `delDoc`(
	IN `docIDparam` INT
)
BEGIN
	DECLARE `_rollback` BOOL DEFAULT 0;
	DECLARE CONTINUE HANDLER FOR SQLEXCEPTION SET `_rollback` = 1;
	START TRANSACTION;
		Delete from hasdocument Where docID = docIDparam;
		Delete from document Where docID = docIDparam;
		IF `_rollback`
			then ROLLBACK;
		else
			COMMIT;
		END IF;
END//
DELIMITER ;

-- Dumping structure for procedure platypus.delEvent
DELIMITER //
CREATE DEFINER=`root`@`localhost` PROCEDURE `delEvent`(
	IN `eventIDparam` INT
)
BEGIN
	DECLARE `_rollback` BOOL DEFAULT 0;
	DECLARE CONTINUE HANDLER FOR SQLEXCEPTION SET `_rollback` = 1;
	START TRANSACTION;
		Delete from hasevent Where eventID = eventIDparam;
		Delete from events Where eventID = eventIDparam;
		IF `_rollback`
			then ROLLBACK;
		else
			COMMIT;
		END IF;
END//
DELIMITER ;

-- Dumping structure for procedure platypus.delGroup
DELIMITER //
CREATE DEFINER=`root`@`localhost` PROCEDURE `delGroup`(
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
	
			Set `counter` = (Select Count(groupID) from hasevent where groupID = groupIDparam);
			if `counter` > 0
			then
				While (Select Count(groupID) from hasevent where groupID = groupIDparam) > 0
				DO
		   		Set eventCount = (Select MIN(eventID) from hasevent where groupID = groupIDparam);
					Delete from hasevent Where eventID = eventCount;
					Delete from events Where eventID = eventCount;
				end while;
			end if;	
			
			Set `counter` = (Select Count(groupID) from hasdocument where groupID = groupIDparam);	
			if `counter` > 0
			then
				While (Select Count(groupID) from hasdocument where groupID = groupIDparam) > 0
				DO
		   		Set docCount = (Select MIN(docID) from hasdocument where groupID = groupIDparam);
					Delete from hasdocument Where docID = docCount;
					Delete from document Where docID = docCount;
				end while;
			end if;
	
			Set `counter` = (Select Count(groupID) from hastask where groupID = groupIDparam);
			if `counter` > 0
			then
				While (Select Count(groupID) from hastask where groupID = groupIDparam) > 0
				DO
			   	Set taskCount = (Select MIN(taskID) from hastask where groupID = groupIDparam);
					Delete from hastask Where taskID = taskCount;
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

-- Dumping structure for procedure platypus.delTask
DELIMITER //
CREATE DEFINER=`root`@`localhost` PROCEDURE `delTask`(
	IN `taskIDparam` INT





)
BEGIN
	DECLARE `_rollback` BOOL DEFAULT 0;
	DECLARE CONTINUE HANDLER FOR SQLEXCEPTION SET `_rollback` = 1;
	START TRANSACTION;
		Delete from hastask Where taskID = taskIDparam;
		Delete from task Where taskID = taskIDparam;
		IF `_rollback`
			then ROLLBACK;
		else
			COMMIT;
		END IF;
END//
DELIMITER ;

-- Dumping structure for procedure platypus.delUser
DELIMITER //
CREATE DEFINER=`root`@`localhost` PROCEDURE `delUser`(
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
		HAVING COUNT(groupID) = 1 and userID = 1) as T);
		
		While `deleteCount` > 0
		DO
			Set `groupIDcheck` = (Select MIN(groupID)
			FROM (
			SELECT groupID, userID
			FROM belongs_to
			Group by groupID
			HAVING COUNT(groupID) = 1 and userID = 1) as M);	
		
			Set `counter` = (Select Count(groupID) from hasevent where groupID = groupIDcheck);
			if `counter` > 0
			then
				While (Select Count(groupID) from hasevent where groupID = groupIDcheck) > 0
				DO
		   		Set eventCount = (Select MIN(eventID) from hasevent where groupID = groupIDcheck);
					Delete from hasevent Where eventID = eventCount;
					Delete from events Where eventID = eventCount;
				end while;
			end if;	
			
			Set `counter` = (Select Count(groupID) from hasdocument where groupID = groupIDcheck);	
			if `counter` > 0
			then
				While (Select Count(groupID) from hasdocument where groupID = groupIDcheck) > 0
				DO
		   		Set docCount = (Select MIN(docID) from hasdocument where groupID = groupIDcheck);
					Delete from hasdocument Where docID = docCount;
					Delete from document Where docID = docCount;
				end while;
			end if;
	
			Set `counter` = (Select Count(groupID) from hastask where groupID = groupIDcheck);
			if `counter` > 0
			then
				While (Select Count(groupID) from hastask where groupID = groupIDcheck) > 0
				DO
			   	Set taskCount = (Select MIN(taskID) from hastask where groupID = groupIDcheck);
					Delete from hastask Where taskID = taskCount;
					Delete from task Where taskID = taskCount;
				end while;
			end if;
			
			Delete from belongs_to where groupID = groupIDcheck;
			Delete from groups Where groupID = groupIDcheck;

			Set `deleteCount` = `deleteCount` - 1;
			
		end while;
		
		Delete from belongs_to where userID = userIDparam;
		Delete from user where userID = userIDparam;
	
	IF `_rollback`
		then ROLLBACK;
	else
		COMMIT;
	END IF;
	
END//
DELIMITER ;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
