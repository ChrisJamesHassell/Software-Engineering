/**
 * Stores user specific information collected on account creation
 *
 * Developers:
 *    Nathan
 */

CREATE TABLE User(
  user_id       INT          NOT NULL UNSIGNED AUTO_INCREMENT,
  firstName     VARCHAR(32)  NOT NULL, -- User's first name, provided on acct create
  lastName      VARCHAR(32) NOT NULL,  -- User's last name, provided on acct create
  email         VARCHAR(128) NOT NULL, -- User's email, provided on acct create
  username      VARCHAR(32)  NOT NULL, -- User's username, provided on acct create
  password      VARCHAR(32)  NOT NULL, -- User's most recent password

  PRIMARY KEY ( user_id )
);

