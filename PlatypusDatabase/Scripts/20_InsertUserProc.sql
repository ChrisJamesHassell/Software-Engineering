use platypus;
DELIMITER //
CREATE DEFINER=`platypus`@`localhost` PROCEDURE `insertUser`(
	IN `username` VARCHAR(32),
	IN `firstName` VARCHAR(32),
	IN `lastName` VARCHAR(32),
	IN `email` VARCHAR(32),
	IN `userPassword` VARCHAR(64),
	IN `dateOfBirth` DATE

)
BEGIN
    DECLARE `_rollback` BOOL DEFAULT 0;
    DECLARE CONTINUE HANDLER 
	 FOR SQLEXCEPTION 
	 BEGIN	 
		 SET `_rollback` = 1;
		 RESIGNAL;
	 END;		 
    START TRANSACTION;
    INSERT INTO users (username, firstName, lastName, email, userPassword, dateOfBirth) 
	 VALUES (
    username, 
    firstName, 
    lastName, 
    email, 
    userPassword, 
    dateOfBirth
	 );
    
    SET @user_id = last_insert_id(); -- retrieve userID
    
    INSERT INTO groups (groupName) VALUES ("Me");
    
    SET @group_id = last_insert_id(); -- retrieve groupID
    
    INSERT INTO belongs_to VALUES (
	 @group_id,
	 @user_id,
	 "1",
	 @user_id
	 );
    
    IF `_rollback` THEN
        ROLLBACK;
     ELSE
        COMMIT;
    END IF;
END//
DELIMITER ;