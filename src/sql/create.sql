CREATE DATABASE `flashcard`;

CREATE TABLE `flashcard`.`user` (
    `ID` BIGINT NOT NULL AUTO_INCREMENT,
    `Name` VARCHAR(50) NOT NULL,
    `Username` VARCHAR(50) NOT NULL,
    `Password` VARCHAR(50) NOT NULL,
    PRIMARY KEY(`ID`)
) ENGINE = MyISAM;

CREATE TABLE `flashcard`.`post` (
    `ID` BIGINT NOT NULL AUTO_INCREMENT,
    `UserID` BIGINT NOT NULL,
    `Content` VARCHAR(250) NOT NULL,
    `Date` DATE,
    PRIMARY KEY(`ID`)
) ENGINE = MyISAM;
ALTER TABLE `post` CHANGE `Date` `Date` DATETIME NULL DEFAULT NULL;

CREATE TABLE `flashcard`.`like` (
    `ID` BIGINT NOT NULL AUTO_INCREMENT,
    `UserID` BIGINT NOT NULL,
    `PostID` BIGINT NOT NULL,
    `Date` DATE,
    PRIMARY KEY(`ID`)
) ENGINE = MyISAM;
ALTER TABLE `like` CHANGE `Date` `Date` DATETIME NULL DEFAULT NULL;

CREATE TABLE `flashcard`.`follow` (
    `ID` BIGINT NOT NULL AUTO_INCREMENT,
    `FollowID` BIGINT NOT NULL,
    `FollowingID` BIGINT NOT NULL,
    PRIMARY KEY(`ID`)
) ENGINE = MyISAM;
ALTER TABLE `follow` CHANGE `FollowID` `UserID` BIGINT(20) NOT NULL;