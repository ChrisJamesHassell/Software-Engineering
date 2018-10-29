DELIMITER $$
CREATE PROCEDURE insertUser(
IN username VARCHAR(32),
IN firstName VARCHAR(32),
IN lastName VARCHAR(32),
IN email VARCHAR(32),
IN userPassword VARCHAR(64),
IN dateOfBirth DATE)
CONTAINS SQL
BEGIN
  DECLARE `_rollback` BOOL DEFAULT 0;
  DECLARE CONTINUE HANDLER FOR SQLEXCEPTION SET `_rollback` = 1;
  START TRANSACTION;
  INSERT INTO users VALUES (
    username,
    firstName,
    lastName,
    email,
    userPassword,
    dateOfBirth);

    SELECT @user_id = last_insert_id(); -- retrieve userID

    INSERT INTO groups VALUES (userName);

    SELECT @group_id = last_insert_id(); -- retrieve groupID

    INSERT INTO belongs_to VALUES ( @group_id, @user_id);

    IF `_rollback` THEN
      ROLLBACK;
    ELSE
      COMMIT;
    END IF;
END $$

DELIMITER ;
