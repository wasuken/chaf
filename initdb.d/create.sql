CREATE TABLE groups(
	   group_id SERIAL PRIMARY KEY,
	   name VARCHAR(200) NOT NULL,
	   parent INT
);
INSERT INTO groups(group_id, name) values(0, 'user');
CREATE TABLE users(
	   user_id SERIAL PRIMARY KEY,
	   name VARCHAR(100) NOT NULL,
	   is_admin BOOLEAN NOT NULL DEFAULT 0,
	   token VARCHAR(45) NOT NULL UNIQUE,
	   email VARCHAR(200) UNIQUE
);
CREATE TABLE user_groups(
	   user_id INT NOT NULL,
	   group_id INT NOT NULL,
	   PRIMARY KEY(user_id, group_id)
);
CREATE TABLE user_attendances(
	   user_attendance_id SERIAL PRIMARY KEY,
	   user_id INT NOT NULL,
	   attendance_type TINYINT NOT NULL,
	   value DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	   FOREIGN KEY(user_id) REFERENCES users(user_id)
);
CREATE INDEX user_attendances_attendance_type_index ON user_attendances(attendance_type) USING BTREE;
