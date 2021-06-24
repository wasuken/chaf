CREATE DATABASE chaf;

USE chaf;

CREATE TABLE grps(
	   grp_id SERIAL PRIMARY KEY,
	   name VARCHAR(200) NOT NULL,
	   parent INT(10)
) CHARACTER SET utf8;

INSERT INTO grps(grp_id, name) values(0, 'user');

CREATE TABLE users(
	   user_id SERIAL PRIMARY KEY,
	   password_hash VARCHAR(128) NOT NULL,
	   name VARCHAR(100) NOT NULL,
	   is_admin BOOLEAN NOT NULL DEFAULT 0,
	   token VARCHAR(45) NOT NULL UNIQUE,
	   email VARCHAR(200) UNIQUE
) CHARACTER SET utf8;

CREATE TABLE user_grps(
	   user_id BIGINT UNSIGNED NOT NULL,
	   grp_id BIGINT UNSIGNED NOT NULL,
	   PRIMARY KEY(user_id, grp_id),
	   FOREIGN KEY(user_id) REFERENCES users(user_id),
	   FOREIGN KEY(grp_id) REFERENCES grps(grp_id)
) CHARACTER SET utf8;
CREATE TABLE user_attendances(
	   user_attendance_id SERIAL PRIMARY KEY,
	   user_id BIGINT UNSIGNED NOT NULL,
	   attendance_type TINYINT NOT NULL,
	   value DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	   FOREIGN KEY(user_id) REFERENCES users(user_id)
) CHARACTER SET utf8;
CREATE INDEX user_attendances_attendance_type_index ON user_attendances(attendance_type) USING BTREE;
