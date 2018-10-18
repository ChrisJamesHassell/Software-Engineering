/**
 * Stores user specific information collected on account creation
 *
 * Developers:
 *    Nathan
 */

CREATE TABLE User(
  user_id       INT         NOT NULL UNIQUE AUTO_INCREMENT,
  name          VARCHAR(32) NOT NULL, -- User's name, provided on acct create
  username      VARCHAR(32) NOT NULL, -- User's username, provided on acct create
  password      VARCHAR(32) NOT NULL, -- User's most recent password

  PRIMARY KEY ( user_id )
);

