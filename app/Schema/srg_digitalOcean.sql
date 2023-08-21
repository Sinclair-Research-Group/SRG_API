use srg;

DROP TABLE IF EXISTS Standard;
DROP TABLE IF EXISTS Respondent_Email;
DROP TABLE IF EXISTS Work_Tools;
DROP TABLE IF EXISTS Mentor_Candidate;
DROP TABLE IF EXISTS Question_Respondent;
DROP TABLE IF EXISTS Survey_Respondent;
DROP TABLE IF EXISTS LEA_Credential_Program;
DROP TABLE IF EXISTS LEA_Survey;
DROP TABLE IF EXISTS Question;
DROP TABLE IF EXISTS Respondent;
DROP TABLE IF EXISTS `Session`;
DROP TABLE IF EXISTS Survey;
DROP TABLE IF EXISTS Credential_Program;
DROP TABLE IF EXISTS LEA;

CREATE TABLE LEA (
	ID BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100),
    lead_LEA VARCHAR(100),
    PRIMARY KEY (ID)
);

CREATE TABLE Credential_Program (
	`name` VARCHAR(200),
    lea BIGINT UNSIGNED NOT NULL,
    `year` VARCHAR(10),
    PRIMARY KEY (`name`, lea),
    FOREIGN KEY (lea) REFERENCES LEA(ID)
		ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE Survey (
	ID VARCHAR(100) PRIMARY KEY,
	credential_program VARCHAR(200),
    lea BIGINT UNSIGNED NOT NULL,
    `name` VARCHAR(200),
    FOREIGN KEY (credential_program) REFERENCES Credential_Program(`name`)
		ON DELETE CASCADE
        ON UPDATE CASCADE,
	FOREIGN KEY (lea) REFERENCES LEA(ID)
		ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE `Session` (
	session_name VARCHAR(200),
    survey VARCHAR(100),
    credential_program VARCHAR(200),
    PRIMARY KEY (session_name, survey, credential_program),
    FOREIGN KEY (survey) REFERENCES Survey(ID)
		ON DELETE CASCADE
        ON UPDATE CASCADE,
	FOREIGN KEY (credential_program) REFERENCES Credential_Program(`name`)
		ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE Respondent (
	ID BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    lea BIGINT UNSIGNED NOT NULL,
    credential_program VARCHAR(200),
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    teacher_group VARCHAR(100),
    program_role VARCHAR(100),
    years VARCHAR(15),
    FOREIGN KEY (lea) REFERENCES LEA(ID)
		ON DELETE CASCADE
        ON UPDATE CASCADE,
	FOREIGN KEY (credential_program) REFERENCES Credential_Program(`name`)
		ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE Question (
	ID BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
	`description` TEXT,
    survey VARCHAR(100),
    `session` VARCHAR(100),
    respondent BIGINT UNSIGNED NOT NULL,
    response TEXT,
    weight MEDIUMINT,
    PRIMARY KEY (ID, survey, respondent),
    FOREIGN KEY (survey) REFERENCES Survey(ID)
		ON DELETE CASCADE
        ON UPDATE CASCADE,
	FOREIGN KEY (respondent) REFERENCES Respondent(ID)
		ON DELETE CASCADE
        ON UPDATE CASCADE,
	FOREIGN KEY (`session`) REFERENCES `Session`(session_name)
		ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE LEA_Survey (
	lea BIGINT UNSIGNED NOT NULL,
    survey VARCHAR(100),
    PRIMARY KEY (lea, survey),
    FOREIGN KEY (lea) REFERENCES LEA(ID)
		ON DELETE CASCADE
        ON UPDATE CASCADE,
	FOREIGN KEY (survey) REFERENCES Survey(ID)
		ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE LEA_Credential_Program (
	lea BIGINT UNSIGNED NOT NULL,
    credential_program VARCHAR(200),
    PRIMARY KEY (lea, credential_program),
    FOREIGN KEY (lea) REFERENCES LEA(ID)
		ON DELETE CASCADE
        ON UPDATE CASCADE,
	FOREIGN KEY (credential_program) REFERENCES Credential_Program(`name`)
		ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE Survey_Respondent (
	survey VARCHAR(100),
    `session` VARCHAR(100),
    respondent BIGINT UNSIGNED NOT NULL,
    PRIMARY KEY (survey, respondent),
    FOREIGN KEY (survey) REFERENCES Survey(ID)
		ON DELETE CASCADE
        ON UPDATE CASCADE,
	FOREIGN KEY (respondent) REFERENCES Respondent(ID)
		ON DELETE CASCADE
        ON UPDATE CASCADE,
	FOREIGN KEY (`session`) REFERENCES `Session`(session_name)
		ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE Question_Respondent (
	question BIGINT UNSIGNED NOT NULL,
    survey VARCHAR(100),
    `session` VARCHAR(100),
    respondent BIGINT UNSIGNED NOT NULL,
    PRIMARY KEY (question, survey, respondent),
    FOREIGN KEY (question) REFERENCES Question(ID)
		ON DELETE CASCADE
        ON UPDATE CASCADE,
	FOREIGN KEY (survey) REFERENCES Survey(ID)
		ON DELETE CASCADE
        ON UPDATE CASCADE,
	FOREIGN KEY (respondent) REFERENCES Respondent(ID)
		ON DELETE CASCADE
        ON UPDATE CASCADE,
	FOREIGN KEY (`session`) REFERENCES `Session`(session_name)
		ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE Mentor_Candidate (
	mentor BIGINT UNSIGNED NOT NULL,
    candidate BIGINT UNSIGNED NOT NULL,
    PRIMARY KEY (mentor, candidate),
    FOREIGN KEY (mentor) REFERENCES Respondent(ID)
		ON DELETE CASCADE
        ON UPDATE CASCADE,
	FOREIGN KEY (candidate) REFERENCES Respondent(ID)
		ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE Work_Tools (
	work_tool VARCHAR(100),
    credential_program VARCHAR(200),
    lea BIGINT UNSIGNED NOT NULL,
    PRIMARY KEY (work_tool, credential_program, lea),
    FOREIGN KEY (credential_program) REFERENCES Credential_Program(`name`)
		ON DELETE CASCADE
        ON UPDATE CASCADE,
	FOREIGN KEY (lea) REFERENCES LEA(ID)
		ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE Respondent_Email (
	email VARCHAR(50),
    respondent BIGINT UNSIGNED NOT NULL,
    PRIMARY KEY (email, respondent),
    FOREIGN KEY (respondent) REFERENCES Respondent(ID)
		ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE Standard (
	question BIGINT UNSIGNED NOT NULL,
    survey VARCHAR(100),
    respondent BIGINT UNSIGNED NOT NULL,
    standard VARCHAR(200),
    PRIMARY KEY (question, survey, respondent, standard),
    FOREIGN KEY (question) REFERENCES Question(ID)
		ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (survey) REFERENCES Survey(ID)
		ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (respondent) REFERENCES Respondent(ID)
		ON DELETE CASCADE
        ON UPDATE CASCADE
);

/* 
	CALCULATE TOTAL RESPONDENTS
*/
DROP FUNCTION IF EXISTS fn_total_respondents;
DELIMITER //

CREATE FUNCTION fn_total_respondents
(
	ID VARCHAR(100)
)
RETURNS BIGINT
READS SQL DATA
DETERMINISTIC 
BEGIN
	DECLARE total BIGINT DEFAULT 0;

	SELECT COUNT(*) 
    INTO total
    FROM Survey_Respondent as SR
    WHERE SR.survey = ID;
	
    RETURN total;
END //
DELIMITER ;

/* 
	CALCULATE TOTAL RESPONDENTS FOR A PARTICULAR QUESTION
*/
DROP FUNCTION IF EXISTS fn_total_respondents_question;
DELIMITER //

CREATE FUNCTION fn_total_respondents_question
(
	ID VARCHAR(100),
    question BIGINT UNSIGNED
)
RETURNS BIGINT
BEGIN
	DECLARE total BIGINT DEFAULT 0;

	SELECT COUNT(*) 
    INTO total
    FROM Question as Q
    WHERE Q.survey = ID AND Q.ID = question;
	
    RETURN total;
END //
DELIMITER ;

/* 
	CALCULATE TOTAL F(X) 
*/

DROP FUNCTION IF EXISTS fn_total_weight;
DELIMITER //

CREATE FUNCTION fn_total_weight
(
	survey VARCHAR(100),
    question BIGINT UNSIGNED
)
RETURNS BIGINT
BEGIN
	DECLARE total_weight BIGINT DEFAULT 0;
    
    SELECT SUM(Q.weight)
    INTO total_weight
    FROM Question as Q 
    WHERE Q.survey = survey AND Q.ID = question;
	
    RETURN total_weight;
END //
DELIMITER ;

/*
	CALCULATE MEAN
*/
DROP FUNCTION IF EXISTS fn_mean;
DELIMITER //

CREATE FUNCTION fn_mean
(
	survey VARCHAR(100),
    question BIGINT UNSIGNED
)
RETURNS BIGINT
BEGIN
	DECLARE mean BIGINT DEFAULT 0;
    DECLARE total_respondents BIGINT DEFAULT 0;
    DECLARE total_fx BIGINT DEFAULT 0;
    
    SET total_respondents = fn_total_respondents_question(survey, question);
    SET total_fx = fn_total_weight(survey, question);
    SET mean = total_fx / total_respondents;
    
    RETURN mean;
END //
DELIMITER ;

/*
	CALCULATE STANDARD DEVIATION
*/
DROP FUNCTION IF EXISTS fn_standard_deviation;
DELIMITER //

CREATE FUNCTION fn_standard_deviation
(
	survey VARCHAR(100),
    question BIGINT UNSIGNED
)
RETURNS DECIMAL(5, 2)
BEGIN
	DECLARE total_weight BIGINT DEFAULT 0;
    DECLARE total_respondents BIGINT DEFAULT 0;
    DECLARE mean BIGINT DEFAULT 0;
    DECLARE step1_3Disagree DECIMAL(5, 2) DEFAULT 0;
    DECLARE step1_2Disagree DECIMAL(5, 2) DEFAULT 0;
    DECLARE step1_1Disagree DECIMAL(5, 2) DEFAULT 0;
    DECLARE step1_3Agree DECIMAL(5, 2) DEFAULT 0;
    DECLARE step1_2Agree DECIMAL(5, 2) DEFAULT 0;
    DECLARE step1_1Agree DECIMAL(5, 2) DEFAULT 0;
	DECLARE total DECIMAL(5, 2) DEFAULT 0;
    DECLARE `variance` DECIMAL(5, 2) DEFAULT 0;
    DECLARE standard_deviation DECIMAL(5, 2) DEFAULT 0;
    
    SET total_weight = fn_total_weight(survey, question);
    SET total_respondents = fn_total_respondents_question(survey, question);
    SET mean = fn_mean(survey, question);
    
    SET step1_3Disagree = fn_step1_2(mean, -3);
    SET step1_2Disagree = fn_step1_2(mean, -2);
    SET step1_1Disagree = fn_step1_2(mean, -1);
    SET step1_3Agree = fn_step1_2(mean, 3);
    SET step1_2Agree = fn_step1_2(mean, 2);
    SET step1_1Agree = fn_step1_2(mean, 1);
    
    SET total = step1_3Disagree + step1_2Disagree + step1_1Disagree + step1_3Agree + step1_2Agree + step1_1Agree;
    SET `variance` = (total / (total_respondents - 1));
    SET standard_deviation = SQRT(variance);
    
	RETURN standard_deviation;
END //
DELIMITER ;

/*
	CALCULATE STEP 1 & 2
*/
DROP FUNCTION IF EXISTS fn_step1_2;
DELIMITER //
CREATE FUNCTION fn_step1_2
(
	mean BIGINT,
    weight MEDIUMINT
)
RETURNS DECIMAL(5, 2)
BEGIN
	DECLARE step1 DECIMAL(5, 2);
    DECLARE weight_minus_mean DECIMAL(5, 2);
    DECLARE step2 DECIMAL(5, 2);
    
    SET weight_minus_mean = weight - mean;
    SET step1 = POWER(weight_minus_mean, 2);
    SET step2 = step1 * weight;
    
    RETURN step2;
END //
DELIMITER ;

/*
	CALCULATE THE COUNT OF RESPONSES FOR A GIVEN SURVEY RESPONSE
    (EX: STRONGLY DISAGREE, ETC.)
*/
DROP FUNCTION IF EXISTS fn_count_responses;
DELIMITER //
CREATE FUNCTION fn_count_responses
(
	survey VARCHAR(100),
    question BIGINT UNSIGNED,
    weight MEDIUMINT
)
RETURNS BIGINT
BEGIN
	DECLARE count_responses BIGINT UNSIGNED DEFAULT 0;
    
    SELECT COUNT(*)
    INTO count_responses
    FROM Question as Q
    WHERE Q.survey = survey AND Q.ID = question AND Q.weight = weight;
    
    RETURN count; 
END //
DELIMITER ;

DROP VIEW IF EXISTS qualitative_questions_palm_1;
CREATE OR REPLACE VIEW qualitative_questions_palm_1 AS
SELECT 
	response
FROM Question
WHERE `description` = 'What are the key learnings you will take away from this experience?';

DROP VIEW IF EXISTS qualitative_questions_palm_2;
CREATE OR REPLACE VIEW qualitative_questions_palm_2 AS
SELECT 
	response
FROM Question
WHERE `description` = 'How will you use what you have learned at this session to increase learning?';

DROP VIEW IF EXISTS qualitative_questions_palm_3;
CREATE OR REPLACE VIEW qualitative_questions_palm_3 AS
SELECT 
	response
FROM Question
WHERE `description` = 'What additional professional support can we provide you in order to build your capacity?';

